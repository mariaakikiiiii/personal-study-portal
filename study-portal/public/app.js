// Floating Chat Toggle Logic
const toggleBtn = document.getElementById('ai-floating-toggle-btn');
const chatBox = document.getElementById('ai-chat-box');
const closeBtn = document.getElementById('ai-close-btn');
const sendBtn = document.getElementById('ai-send-btn');
const chatInput = document.getElementById('ai-chat-input');
const chatMessages = document.getElementById('ai-chat-messages');
const newChatBtn = document.getElementById('ai-new-chat-btn');

if (toggleBtn && chatBox) {
  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
  });
}

if (closeBtn && chatBox) {
  closeBtn.addEventListener('click', () => {
    chatBox.classList.add('hidden');
  });
}

if (newChatBtn && chatMessages) {
  newChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '<div class="ai-msg bot">Started a new chat session. How can I assist?</div>';
  });
}

function handleSendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg user';
  userMsg.textContent = text;
  chatMessages.appendChild(userMsg);

  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simulate automated response or connection to backend
  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.className = 'ai-msg bot';
    botMsg.textContent = "I'm connected to your backend assistant pipeline!";
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 600);
}

if (sendBtn && chatInput) {
  sendBtn.addEventListener('click', handleSendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
}

// Course dialog triggers
const courseCards = document.querySelectorAll('.course-card');
const courseDialog = document.getElementById('course-dialog');
const courseTitle = document.getElementById('course-title');
const closeDialogBtn = document.getElementById('close-dialog');

courseCards.forEach(card => {
  card.addEventListener('click', () => {
    const title = card.getAttribute('data-course');
    if (courseTitle && courseDialog) {
      courseTitle.textContent = title;
      courseDialog.showModal();
    }
  });
});

if (closeDialogBtn && courseDialog) {
  closeDialogBtn.addEventListener('click', () => {
    courseDialog.close();
  });
}