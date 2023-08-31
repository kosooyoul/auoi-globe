class GlobeSocket {
  onlineObjects = {};
  socketId = null;

  lastPlayerStatusPostedAt;

  constructor() {
    this.socket = new io('https://subscribe.auoi.net');

    this.socket.on('ready', (event) => this._onOnlineReady(event));
    this.socket.on('enter', (event) => this._onOnlineEnter(event));
    this.socket.on('move', (event) => this._onOnlineMove(event));
    this.socket.on('leave', (event) => this._onOnlineLeave(event));
    this.socket.on('message', (event) => this._onOnlineChat(event));

    window.addEventListener('message', (event) => this._onEvent(event));
  }

  _onOnlineReady(data) {
    this.socketId = data.id;
    console.log('socketId', data);

    for (const id in data.objects) {
      const object = data.objects[id];
      this.onlineObjects[id] = { id: object.id, quaternion: object.q, action: object.a, message: null };
    }

    // socket.emit('enter', { q: object.q, a: object.a  });x
  }

  _onOnlineEnter(data) {
    if (data.id == this.socketId) return;

    this.onlineObjects[data.id] = {
      id: data.id,
      quaternion: data.q,
      action: data.a,
      message: null,
    };
  }

  _onOnlineMove(data) {
    if (data.id == this.socketId) return;

    window.postMessage({ type: 'people-status', id: data.id, quaternion: data.q, action: data.a });

    // if (this.onlineObjects[data.id] == null) {
    //   this.onlineObjects[data.id] = {
    //     id: data.id,
    //     quaternion: data.q,
    //     action: data.a,
    //     message: null,
    //   };
    // } else {
    //   this.onlineObjects[data.id].quaternion = data.q;
    //   this.onlineObjects[data.id].action = data.a;
    //   this.onlineObjects[data.id].message = data.m;
    // }
  }

  _onOnlineLeave(data) {
    if (data.id == this.socketId) return;

    delete this.onlineObjects[data.id];
  }

  _onOnlineChat(data) {
    if (data.id == this.socketId) return;

    window.postMessage({ type: 'people-message', id: data.id, message: data.message });

    // if (this.onlineObjects[data.id] != null) {
    //   this.onlineObjects[data.id].message = data.m;
    //   this.onlineObjects[data.id].messageExpiresIn = Date.now() + 1000 * 5;
    // }
  };

  _onEvent (event) {
    if (event.data.type == 'player-status') {
      if (Date.now() - this.lastPlayerStatusPostedAt < 1000) return;

      this.sendPlayerStatus({ quaternion: event.data.quaternion, action: event.data.action });
      this.lastPlayerStatusPostedAt = Date.now();
    } else if (event.data.type == 'player-message') {
      this.sendChat(event.data.message);
    }
  }

  sendChat(message) {
    this.socket.emit('message', { message });
    window.postMessage({ type: 'people-message', id: socketId, message: message });
  };

  sendPlayerStatus({ quaternion, action }) {
		this.socket.emit('move', { q: quaternion, a: action });
  };
}

export { GlobeSocket }