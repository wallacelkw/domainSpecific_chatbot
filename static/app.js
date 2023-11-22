class Chatbox {
  constructor(name) {
      this.name = name;
      this.args = {
          chatBox: document.querySelector(`.chatbox__support[data-name="${name}"]`),
          sendButton: document.querySelector(`.send__button[data-name="${name}"]`),
          inputField: document.querySelector(`input[data-name="${name}"]`),
          // Add other necessary elements specific to each chatbox using their names
      };
      this.state = false;
      this.messages = [];
      this.display(); // Call the display method immediately upon creation
      
  }

  

  display() {
      const { chatBox, sendButton, inputField} = this.args;

      sendButton.addEventListener('click', () => this.onSendButton(chatBox, inputField.id));

      inputField.addEventListener('keyup', ({ key }) => {
          if (key === 'Enter') {
              this.onSendButton(chatBox, inputField.id);
          }
      });
  }

  onSendButton(chatbox, source) {
      var textField = this.args.inputField;
      var sendButton = this.args.sendButton;

      let text1 = textField.value;
      if (text1 == '') {
          return;
      }

      let msg1 = { name: 'User', message: text1 };
      console.log('Message: ', msg1);
      this.messages.push(msg1);
      // Add loading indicator
      let loadingMsg = { name: 'System', message: 'Loading...' };
      this.messages.push(loadingMsg);
      this.updateChatText(chatbox);
      textField.value = '';
      textField.disabled = true;
      sendButton.disabled = true;
      
      fetch('/predict', {
          method: 'POST',
          body: JSON.stringify({ message: text1, source: source}),
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
      })
      .then((r) => r.json())
      .then((r) => {
          let answer = r.answer ? r.answer : 'No answer found';
          this.messages = this.messages.filter((msg) => msg !== loadingMsg);
          let msg2 = { name: 'Sam', message: answer };
          this.messages.push(msg2);
          this.updateChatText(chatbox);
          console.log('Sam Reply: ', msg2);
          textField.value = '';

          textField.disabled = false;
          sendButton.disabled = false;
      })
      .catch((error) => {
          console.error('Error:', error);
          this.updateChatText(chatbox);
          textField.value = '';

          textField.disabled = false;
          sendButton.disabled = false;
      });
  }

  updateChatText(chatbox) {
    var html = '';



    
    this.messages
        .slice()
        .reverse()
        .forEach(function (item) {
            console.log("Item: ", item)
            if (item.name == 'Sam') {
                html +=
                    '<div class="messages__item messages__item--visitor">' +
                    item.message +
                    '</div>';
            } else if (item.name == 'System') {
                html +=
                    '<div class="messages__item messages__item--visitor">' +
                    '<div class="loader"></div>' +
                    '</div>';
            } else {
                html +=
                    '<div class="messages__item messages__item--operator">' +
                    item.message +
                    '</div>';
            }
        });
    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
  }
}

class ChatboxManager {
  constructor() {
      this.chatboxes = {};
  }

  addChatbox(name, chatbox) {
      this.chatboxes[name] = chatbox;
  }

  getChatbox(name) {
      return this.chatboxes[name];
  }

  // Add other methods as needed to manage chatboxes
}

// Usage
const chatManager = new ChatboxManager();

const ecommerceChatbox = new Chatbox('EcommerceFAQ');
const malaysianQAChatbox = new Chatbox('MalaysianQA');

chatManager.addChatbox('EcommerceFAQ', ecommerceChatbox);
chatManager.addChatbox('MalaysianQA', malaysianQAChatbox);

document.addEventListener('DOMContentLoaded', function() {
  const toggleChatButton = document.getElementById('toggleChatButton');
  const chatbox1 = document.getElementById('chatbox1');
  const chatbox2 = document.getElementById('chatbox2');

  let activeChatbox = 1;

  toggleChatButton.addEventListener('click', function() {
    if (activeChatbox === 1) {
      chatbox1.style.display = 'none';
      chatbox2.style.display = 'flex';
      activeChatbox = 2;
    } else {
      chatbox1.style.display = 'flex';
      chatbox2.style.display = 'none';
      activeChatbox = 1;
    }
  });
});

