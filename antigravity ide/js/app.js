document.addEventListener('DOMContentLoaded', () => {

  // 1. Data Modal Routers (Replaces global link intercept)
  const dataModals = {
    'pop-finder': document.getElementById('modal-pop-finder'),
    'tables': document.getElementById('modal-tables'),
    'library': document.getElementById('modal-library'),
    'about': document.getElementById('modal-about'),
    'about-us': document.getElementById('modal-about-us'),
    'divisions': document.getElementById('modal-divisions'),
    'data-resource': document.getElementById('modal-data-resource'),
    'media': document.getElementById('modal-media'),
    'acts-rules': document.getElementById('modal-acts-rules'),
    'rti': document.getElementById('modal-rti'),
    'geospatial': document.getElementById('modal-geospatial')
  };

  // Open modals based on data-target attribute
  document.querySelectorAll('[data-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      if (dataModals[targetId]) {
        dataModals[targetId].style.display = 'flex';
      }
    });
  });

  // Close modals
  document.querySelectorAll('.close-data-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.data-modal-overlay').style.display = 'none';
    });
  });

  // 2. Strict 11-Digit SE-ID Generator (starts with 27)
  const generateSEID = () => {
    return '27' + Math.floor(100000000 + Math.random() * 900000000).toString();
  };

  // 3. Portal Page Logic
  const btnPhase2 = document.getElementById('btn-phase2');
  if (btnPhase2) {
    const savedId = localStorage.getItem('census2027_seid');
    if (savedId) {
      btnPhase2.style.display = 'inline-block';
      btnPhase2.addEventListener('click', (e) => {
        e.preventDefault();
        const input = prompt('Please enter your 11-digit numeric SE-ID to continue:');
        if (input && input.trim() === savedId) {
          window.location.href = 'phase2.html';
        } else {
          alert('Invalid ID or cancelled. Please try again.');
        }
      });
    }
  }

  // 4. Phase 1 Form Logic
  const phase1Form = document.getElementById('phase1-form');
  if (phase1Form) {
    phase1Form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(phase1Form);
      const data = Object.fromEntries(formData.entries());
      
      const newId = generateSEID();
      
      localStorage.setItem('census2027_seid', newId);
      localStorage.setItem('census2027_phase1', JSON.stringify(data));
      
      const formWrapper = document.getElementById('phase1-form-wrapper');
      const successContainer = document.getElementById('phase1-success-container');
      const idDisplay = document.getElementById('phase1-new-id');
      const btnReturn = document.getElementById('btn-return-portal');

      if (formWrapper && successContainer && idDisplay) {
        formWrapper.style.display = 'none';
        idDisplay.innerText = newId;
        successContainer.style.display = 'block';

        if (btnReturn) {
          btnReturn.addEventListener('click', () => {
            window.location.href = 'portal.html';
          });
        }
      } else {
        // Fallback
        alert(`Phase 1 Submitted Successfully!\n\nYour 11-Digit Self-Enumeration ID is: ${newId}\n\nPlease keep this safe for Phase 2.`);
        window.location.href = 'portal.html';
      }
    });
  }

  // 5. Phase 2 Form Logic
  const phase2Form = document.getElementById('phase2-form');
  if (phase2Form) {
    const savedId = localStorage.getItem('census2027_seid');
    if (!savedId || savedId.length !== 11) {
      alert('Unauthorized access. Please complete Phase 1 first.');
      window.location.href = 'portal.html';
      return;
    }

    // Greet user
    try {
      const phase1Data = JSON.parse(localStorage.getItem('census2027_phase1'));
      if (phase1Data && phase1Data.headName) {
        document.getElementById('welcome-message').innerText = `Welcome, ${phase1Data.headName}`;
      }
    } catch (err) {
      console.error('Failed to parse phase 1 data');
    }

    // Submit logic
    phase2Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const finalId = generateSEID();
      localStorage.setItem('census2027_final_seid', finalId);
      
      const modal = document.getElementById('success-modal');
      const finalDisplay = document.getElementById('final-se-id');
      const btnFinish = document.getElementById('btn-finish');

      finalDisplay.innerText = finalId;
      modal.style.display = 'flex'; // show modal

      btnFinish.addEventListener('click', () => {
        localStorage.removeItem('census2027_seid');
        localStorage.removeItem('census2027_phase1');
        localStorage.removeItem('census2027_final_seid');
        window.location.href = 'portal.html';
      });
    });
  }

  // 6. Chatbot Logic
  const chatFab = document.getElementById('chatbot-fab');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatChips = document.querySelectorAll('.chip');

  if (chatFab && chatWindow) {
    chatFab.addEventListener('click', () => {
      chatWindow.classList.add('active');
    });

    closeChat.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });

    const addMessage = (text, sender = 'user') => {
      const msg = document.createElement('div');
      msg.className = `chat-msg ${sender}`;
      msg.innerText = text;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const processAIResponse = (query) => {
      const lowerQ = query.toLowerCase();
      let response = "I'm sorry, I don't understand that query. Please ask about documents, Phase 1, SE ID, or editing forms.";
      
      if (lowerQ.includes('document')) {
        response = "You will need a valid government ID (Aadhaar, Voter ID, PAN) and basic household details for Phase 1.";
      } else if (lowerQ.includes('phase 1') || lowerQ.includes('long')) {
        response = "Phase 1 (Houselisting) typically takes 10-15 minutes to complete online. You will answer 31 questions about your household.";
      } else if (lowerQ.includes('se id') || lowerQ.includes('seid')) {
        response = "The SE-ID (Self-Enumeration ID) is a strict 11-digit numeric code generated after you complete Phase 1. You must save it to access Phase 2.";
      } else if (lowerQ.includes('edit') || lowerQ.includes('change')) {
        response = "Forms cannot be edited once submitted. Please double-check all details before final submission.";
      }
      
      setTimeout(() => addMessage(response, 'bot'), 500);
    };

    chatSendBtn.addEventListener('click', () => {
      const val = chatInput.value.trim();
      if (val) {
        addMessage(val, 'user');
        chatInput.value = '';
        processAIResponse(val);
      }
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') chatSendBtn.click();
    });

    chatChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.innerText;
        addMessage(text, 'user');
        processAIResponse(text);
      });
    });
  }

});
