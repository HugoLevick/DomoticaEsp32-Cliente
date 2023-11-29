const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-messages');
const chatButton = document.querySelector('.chat-button');
const chatForm = document.querySelector('.chat-form');

const messages = [];
let sendingMessage = false;

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (sendingMessage) return;
  sendingMessage = true;
  chatButton.disabled = true;

  const message = chatInput.value.trim();

  const sendMsgElement = document.createElement('div');
  sendMsgElement.classList.add('chat-bubble');
  sendMsgElement.classList.add('send');
  sendMsgElement.innerHTML = message;
  chatMessages.appendChild(sendMsgElement);

  const loadingBubble = showLoadingChat();
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (!message) return;
  messages.push({ role: 'user', content: message });
  chatInput.value = '';
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (response.ok) {
    loadingBubble.remove();
    const data = await response.json();
    console.log(data);
    messages.push({ role: 'assistant', content: JSON.stringify(data) });
    const receiveMsgElement = document.createElement('div');
    receiveMsgElement.classList.add('chat-bubble');
    receiveMsgElement.classList.add('receive');
    receiveMsgElement.innerHTML = data.respuesta;
    chatMessages.appendChild(receiveMsgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    chatButton.disabled = false;
  } else {
    messages.pop();
    console.log(error);
  }
  sendingMessage = false;
});

function showLoadingChat() {
  const loadingBubble = document.createElement('div');
  loadingBubble.classList.add('chat-bubble');
  loadingBubble.classList.add('receive');

  const loadingAnimation = document.createElement('div');
  loadingAnimation.classList.add('loader');

  loadingBubble.appendChild(loadingAnimation);
  chatMessages.appendChild(loadingBubble);
  return loadingBubble;
}
