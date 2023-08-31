class GlobeChatView {
  mode;

  showButton;
  messageList;
  typingBox;
  submitButton;

  constructor() {
    this.showButton = document.querySelector('.button-show-typing');
    this.messageList = document.querySelector('.list-message');
    this.typingBox = document.querySelector('.input-typing');
    this.submitButton = document.querySelector('.button-submit-typing');
    
    this.initializeEvent();

    this.setTypingMode();
  }

  initializeEvent() {
    window.addEventListener('message', (event) => this._onMessage(event));
    window.addEventListener('keydown', (event) => this._onWindowKeyDown(event));

    this.showButton.addEventListener('click', (event) => this._onShowButtonClick(event));
    this.typingBox.addEventListener('keydown', (event) => this._onTypingBoxKeydown(event));
    this.submitButton.addEventListener('click', (event) => this._onSubmitButtonClick(event));
  }

  _onMessage(event) {
    if (event.data.type == 'people-message') {
      const item = document.createElement('li');
      item.textContent = `[${event.data.id}] ${event.data.message}`;
      this.messageList.prepend(item);
    }
  }

  _onWindowKeyDown(event) {
    if (event.which == 13) {
      this.setTypingMode();
    } else if (event.which == 27) {
      this.setMovingMode();
    }
  }

  _onShowButtonClick(event) {
    this.setTypingMode();
  }

  _onTypingBoxKeydown(event) {
    if (this.mode != "typing") return;
    
    if (event.which == 13) {
      const success = this._submit();
      if (success == false) {
        setTimeout(() => {
          this.setMovingMode();
        });
      }
    }
  }

  _onSubmitButtonClick(event) {
    if (this.mode != "typing") return;

    this._submit();
  }

  setTypingMode() {
    document.body.setAttribute('data-mode', this.mode = 'typing');
    this.typingBox.disabled = false;
    this.typingBox.focus();
  };
  
  setMovingMode() {
    document.body.setAttribute('data-mode', this.mode = 'moving');
    this.typingBox.disabled = true;
    this.typingBox.blur();
  };

  _submit() {
    const typingContent = this.typingBox.value.trim();
    if (!typingContent) {
      this.typingBox.value = null;
      return false;
    }

    this.typingBox.value = null;

    this._sendMessage(typingContent);
    
    return true;
  }

  _sendMessage(message) {
    window.postMessage({ 'type': 'player-message', 'message': message });
  }
}

export { GlobeChatView }