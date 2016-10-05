let instance = null;
export default class ServerState {

  constructor () {
    if (instance) {
      throw "ServerState() only allow to construct once";
    }
    instance = this;
    this._user = {};
  }

  static get instance() {
    if (!instance) throw "ServerState() need to construct first";
    return instance;
  }

  get host() {
      return this._host;
    }
  get user() {
    return this._user;
  }

  loadApp() {
    return this._callServer('/api/auth/loadapp').then(init => {
      this._user = init.auth && init.user
    });
  }

  _callServer(path, mode = 'GET', body) {
    return new Promise( (resolve, reject) => {
       // Instantiates the XMLHttpRequest
       var client = new XMLHttpRequest();
       client.open(mode, path);
       client.setRequestHeader ("Authorization", "OAuth " + "Junk");
       client.withCredentials = true;
       if (mode === 'POST') {
         console.log ('_callServer: POSTING to [' + path + ']: ' + JSON.stringify(body));
         client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
         client.send(JSON.stringify(body));
       } else {
         client.send();
       }
       client.onload = function () {
         if (this.status == 200) {
           // Performs the function "resolve" when this.status is equal to 200
           //console.log ('got records : ' + this.response);
           resolve(JSON.parse(this.response));
         } else {
           // Performs the function "reject" when this.status is different than 200
           reject(this.response);
         }
       };
       client.onerror = function (e) {
         reject("Network Error: " + this.statusText);
       };
     });
  }


}