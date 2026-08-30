/**
 * Abroad Study Info — Course Finder Chat Widget
 * -------------------------------------------------
 * Public-safe portfolio version.
 *
 * Expected page elements:
 *   #asi-bubble-btn
 *   #asi-thread
 *   #asi-controls
 */

window.addEventListener('load', function () {
  const WEBHOOK_URL = "https://YOUR_N8N_DOMAIN/webhook/course-finder";
  const LEADS_WEBHOOK_URL = "https://YOUR_N8N_DOMAIN/webhook/save-lead";
  const CALENDAR_URL = "YOUR_GOOGLE_CALENDAR_BOOKING_URL";
  const WHATSAPP_NUMBER = "YOUR_WHATSAPP_NUMBER";
  const LOG_URL = "https://YOUR_N8N_DOMAIN/webhook/log-message";
  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

  let logQueue = Promise.resolve();

  function logMessage(sender, message) {
    logQueue = logQueue.then(() => {
      return fetch(LOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          sender,
          message
        })
      }).catch(err => console.error('Log failed:', err));
    });
  }

  const thread = document.getElementById('asi-thread');
  const controls = document.getElementById('asi-controls');
  const launcher = document.getElementById('asi-bubble-btn');

  if (!thread || !controls || !launcher) {
    console.error('Course Finder widget: required page elements are missing.');
    return;
  }

  const answers = {
    degree_type: '',
    course: '',
    background: '',
    intake: '',
    email: ''
  };

  function scrollDown() {
    thread.scrollTop = thread.scrollHeight;
  }

  function botBubble(text) {
    const d = document.createElement('div');
    d.style.cssText = 'background:#f1f4f9;border-radius:14px 14px 14px 3px;padding:10px 14px;font-size:14px;line-height:1.5;max-width:85%;align-self:flex-start;color:#1a2b3c;white-space:pre-line;';
    d.textContent = text;
    logMessage('Bot', text);
    thread.appendChild(d);
    scrollDown();
  }

  function userBubble(text) {
    const d = document.createElement('div');
    d.style.cssText = 'background:#1a3c6e;color:#fff;border-radius:14px 14px 3px 14px;padding:10px 14px;font-size:14px;max-width:85%;align-self:flex-end;';
    d.textContent = text;
    logMessage('Student', text);
    thread.appendChild(d);
    scrollDown();
  }

  function typingBubble() {
    const d = document.createElement('div');
    d.id = 'asi-typing';
    d.style.cssText = 'background:#f1f4f9;border-radius:14px;padding:10px 14px;font-size:14px;max-width:60px;align-self:flex-start;color:#888;';
    d.textContent = '· · ·';
    thread.appendChild(d);
    scrollDown();
    return d;
  }

  function clearControls() {
    controls.innerHTML = '';
  }

  function optionButtons(options, onPick) {
    clearControls();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';

    options.forEach(opt => {
      const b = document.createElement('button');
      b.textContent = opt;
      b.style.cssText = 'padding:8px 14px;border-radius:20px;border:1px solid #1a3c6e;background:#fff;color:#1a3c6e;font-size:13px;cursor:pointer;';
      b.onmouseenter = () => b.style.background = '#1a3c6e10';
      b.onmouseleave = () => b.style.background = '#fff';
      b.onclick = () => {
        userBubble(opt);
        clearControls();
        onPick(opt);
      };
      wrap.appendChild(b);
    });

    controls.appendChild(wrap);
  }

  function textInput(placeholder, onSubmit, inputType) {
    clearControls();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;gap:8px;';

    const input = document.createElement('input');
    input.type = inputType || 'text';
    input.placeholder = placeholder;
    input.style.cssText = 'flex:1;padding:10px 12px;border-radius:20px;border:1px solid #ccc;font-size:14px;outline:none;';

    const btn = document.createElement('button');
    btn.textContent = 'Send';
    btn.style.cssText = 'padding:10px 18px;border-radius:20px;border:none;background:#1a3c6e;color:#fff;font-size:13px;cursor:pointer;';

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      userBubble(val);
      clearControls();
      onSubmit(val);
    }

    btn.onclick = submit;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') submit();
    });

    wrap.appendChild(input);
    wrap.appendChild(btn);
    controls.appendChild(wrap);
    input.focus();
  }

  function step1() {
    botBubble("Hi! I'm the Abroad Study Info Assistant. I can help you find university programmes in Italy. Let's find some options for you.\n\nWhat degree are you looking for?");
    optionButtons(["Bachelor's", "Master's", "Single Cycle Degree"], choice => {
      answers.degree_type = choice;
      setTimeout(step2, 300);
    });
  }

  function step2() {
    botBubble('What would you like to study? (e.g. Data Science, Business, Engineering, Medicine)');
    textInput('Type a subject...', val => {
      answers.course = val;
      setTimeout(step3, 300);
    });
  }

  function step3() {
    botBubble('Tell me a bit about your academic background (e.g. your current or most recent degree/field of study).');
    textInput('Your background...', val => {
      answers.background = val;
      setTimeout(step4, 300);
    });
  }

  function step4() {
    botBubble('When are you planning to apply?');
    optionButtons(['2027', '2028', 'Not sure yet'], choice => {
      answers.intake = choice;
      setTimeout(step5, 300);
    });
  }

  function step5() {
    botBubble("Great — what's your email address? We'll use this to send you your matched courses and keep you updated.");
    textInput('your@email.com', val => {
      answers.email = val;
      setTimeout(submitToBackend, 300);
    }, 'email');
  }

  function submitToBackend() {
    const typing = typingBubble();
    const payload = {
      degree_type: answers.degree_type,
      course: answers.course
    };

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        typing.remove();
        showResults(data);
      })
      .catch(err => {
        typing.remove();
        botBubble('Sorry, something went wrong reaching our course database. Please try again in a moment, or contact us directly on WhatsApp.');
        console.error(err);
      });
  }

  function showResults(courses) {
    if (!Array.isArray(courses) || courses.length === 0) {
      botBubble("I couldn't find a suitable course based on those preferences. Would you like to try a different subject or degree?");
      optionButtons(['Try again', 'Talk to a counsellor'], choice => {
        if (choice === 'Try again') {
          thread.innerHTML = '';
          step1();
        } else {
          showNextStepMenu();
        }
      });
      return;
    }

    let text = `I found ${courses.length} option${courses.length > 1 ? 's' : ''} based on your preferences:\n\n`;
    courses.forEach((c, i) => {
      const row = c.json || c;
      text += `${i + 1}. ${row['Course name']}\n   ${row['University']} — ${row['City']}, ${row['Region']}\n\n`;
    });
    text += 'These are preliminary suggestions. Admission eligibility has not been assessed.';
    botBubble(text);

    setTimeout(showNextStepMenu, 500);
  }

  function showNextStepMenu() {
    botBubble('What would you like to do next?');
    optionButtons([
      'Explore Our Admission Services',
      'Book a Q&A 1:1 session',
      'I will apply on my own'
    ], handleNextStep);
  }

  function handleNextStep(choice) {
    if (choice === 'Explore Our Admission Services') {
      showAdmissionServicesMenu();
    } else if (choice === 'Book a Q&A 1:1 session') {
      botBubble('Opening the booking calendar...');
      window.open(CALENDAR_URL, '_blank');
      setTimeout(() => {
        botBubble('You can also reach us directly:');
        showFinalContactLinks();
      }, 500);
    } else {
      botBubble('Great — good luck with your application! If you ever want guidance along the way, feel free to come back anytime.');
    }
  }

  function showAdmissionServicesMenu() {
    optionButtons(['Request a Callback', 'Enquire on WhatsApp'], choice => {
      if (choice === 'Request a Callback') {
        showCallbackForm();
      } else {
        botBubble('Opening WhatsApp...');
        window.open('https://wa.me/' + WHATSAPP_NUMBER, '_blank');
      }
    });
  }

  function showCallbackForm() {
    botBubble("Please share your details and we'll call you back.");
    clearControls();

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Your name';
    nameInput.style.cssText = 'padding:10px 12px;border-radius:10px;border:1px solid #ccc;font-size:14px;outline:none;';

    const phoneWrap = document.createElement('div');
    phoneWrap.style.cssText = 'display:flex;gap:6px;';

    const countrySelect = document.createElement('select');
    countrySelect.style.cssText = 'padding:10px 6px;border-radius:10px;border:1px solid #ccc;font-size:13px;outline:none;background:#fff;max-width:130px;';

    const countries = [
      { code: '+39', label: 'Italy +39' },
      { code: '+91', label: 'India +91' },
      { code: '+1', label: 'United States +1' },
      { code: '+44', label: 'United Kingdom +44' }
    ];

    countries.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = c.label;
      countrySelect.appendChild(opt);
    });
    countrySelect.value = '+39';

    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = 'Phone number';
    phoneInput.style.cssText = 'flex:1;padding:10px 12px;border-radius:10px;border:1px solid #ccc;font-size:14px;outline:none;';
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });

    phoneWrap.appendChild(countrySelect);
    phoneWrap.appendChild(phoneInput);

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Request callback';
    submitBtn.style.cssText = 'padding:10px 14px;border-radius:10px;border:none;background:#1a3c6e;color:#fff;font-size:14px;cursor:pointer;margin-top:4px;';

    submitBtn.onclick = () => {
      const name = nameInput.value.trim();
      const phoneDigits = phoneInput.value.trim();

      if (!name) {
        alert('Please enter your name.');
        return;
      }
      if (phoneDigits.length < 7 || phoneDigits.length > 12) {
        alert('Please enter a valid phone number (7-12 digits).');
        return;
      }

      const fullWhatsapp = countrySelect.value + phoneDigits;
      userBubble(`${name} · ${fullWhatsapp}`);
      clearControls();
      submitLead({ name, email: answers.email, whatsapp: fullWhatsapp });
    };

    wrap.appendChild(nameInput);
    wrap.appendChild(phoneWrap);
    wrap.appendChild(submitBtn);
    controls.appendChild(wrap);
  }

  function submitLead(contact) {
    const typing = typingBubble();
    const leadPayload = {
      name: contact.name,
      email: contact.email,
      whatsapp: contact.whatsapp,
      degree_type: answers.degree_type,
      course: answers.course,
      background: answers.background,
      intake: answers.intake
    };

    fetch(LEADS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    })
      .then(() => {
        typing.remove();
        botBubble('Thank you! Your details have been sent to our team. A counsellor will call you back soon.');
      })
      .catch(err => {
        typing.remove();
        botBubble("Your details couldn't be saved right now, but you can still reach us directly on WhatsApp below.");
        showFinalContactLinks();
        console.error(err);
      });
  }

  function showFinalContactLinks() {
    clearControls();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    const wa = document.createElement('a');
    wa.href = 'https://wa.me/' + WHATSAPP_NUMBER;
    wa.target = '_blank';
    wa.textContent = 'Message us on WhatsApp';
    wa.style.cssText = 'text-align:center;padding:10px;border-radius:10px;background:#25D366;color:#fff;text-decoration:none;font-size:14px;';

    wrap.appendChild(wa);
    controls.appendChild(wrap);
  }

  launcher.addEventListener('click', function () {
    if (!thread.hasChildNodes()) step1();
  }, { once: true });
});
