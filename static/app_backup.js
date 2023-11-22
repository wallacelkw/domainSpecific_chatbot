class Chatbox {
    constructor() {
      this.args = {
        // openButton: document.querySelector('.chatbox__button'),
        chatBox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button'),
      }
  
      this.state = false;
      this.messages = [];
    }
  
    display() {
      const {chatBox, sendButton } = this.args;
  
      // openButton.addEventListener('click', () => this.toggleState(chatBox));
  
      sendButton.addEventListener('click', () => this.onSendButton(chatBox));
  
      const node = chatBox.querySelector('input');
      node.addEventListener('keyup', ({ key }) => {
        if (key == 'Enter') {
          this.onSendButton(chatBox);
        }
      });
    }

  
    onSendButton(chatbox) {
      var textField = chatbox.querySelector('input');
      var sendButton = chatbox.querySelector('.send__button');


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
        body: JSON.stringify({ message: text1 }),
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
          }else if (item.name=='System'){
            html +=
              '<div class="messages__item messages__item--visitor">'+
              '<div class="loader"></div>'+
              '</div>';
          }
          else{
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

  function adjustTextareaHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
  

  
const chatbox = new Chatbox();
chatbox.display();
  