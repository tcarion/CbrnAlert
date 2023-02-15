import { HostListener, Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  connection$: WebSocketSubject<any>;
  channel: string;
  // Genie: any = {};

  // @HostListener('window:beforeunload')
  // closeChannel() {
  //     console.log("Preparing to unload");

  //     if (this.Genie.Settings.webchannels_autosubscribe) {
  //         this.unsubscribe();
  //     }

  //     if (this.Genie.WebChannels.channel.readyState === 1) {
  //         this.Genie.WebChannels.channel.close();
  //     }
  // };

  constructor(
    // private apiService: ApiService_old,
    private authenticationService: AuthenticationService,
  ) { }

  connect() {
    // console.log(environment.rootWs)
    // this.connection$ = webSocket({
    //   url: environment.rootWs,
    //   deserializer: msg => {
    //     let r;
    //     try {
    //       r = JSON.parse(msg.data);
    //     } catch (error) {
    //       r = msg.data;
    //     }
    //     return r;
    //   }
    // });
    // this.connection$.subscribe();
    // this.initHandler();
    // this.initChannel();
    // this.channel = this.authenticationService.currentUserValue.email
    // this.channelSubscribe(this.channel)
    // console.log("connected to ws");
    console.log("websocket currently disabled");
  }

  disconnect() {
    this.channelUnsubscribe();
    this.connection$.complete();
    this.connection$.unsubscribe();
  }

  channelSubscribe(channel: string) {
    if (this.connection$) {
      let to_send = {
        'channel': channel,
        'message': "subscribe",
        'payload': {}
      }
      this.connection$.next(to_send)
    } else {
      console.error('Connection not open')
    }
  }

  channelUnsubscribe() {
    if (this.connection$ && this.channel !== undefined) {
      let to_send = {
        'channel': this.channel,
        'message': "unsubscribe",
        'payload': {}
      }
      this.connection$.next(to_send)
      console.log('Unsubscribed to channel')
    } else {
      console.error('Connection not open')
    }
  }

  // initHandler(
  //     parse_payload: Function = (msg: any) => console.log(`message received : ${msg}`)) {
  //     this.connection$.subscribe(
  //         msg => parse_payload(msg),
  //         err => console.error(err),
  //         () => console.log('Connection closed')
  //     )
  // }

  // initChannel() {
  //     this.apiService.getChannel().subscribe({
  //         next: (res: any) => {
  //             this.channel = res.channel;
  //             this.channelSubscribe(this.channel);
  //         }
  //     })
  // }

  // initGenie() {
  //     this.Genie.Settings = {
  //         "webchannels_autosubscribe": false,
  //         "server_host": "127.0.0.1",
  //         "webthreads_js_file": "webthreads.js",
  //         "webchannels_unsubscribe_channel": "unsubscribe",
  //         "webthreads_default_route": "__",
  //         "webchannels_subscribe_channel": "subscribe",
  //         "server_port": 8000, "base_path": "/",
  //         "webthreads_pull_route": "pull",
  //         "webchannels_default_route": "channel1",
  //         "webthreads_push_route": "push",
  //         "websockets_port": 8000 }

  //     this.Genie.WebChannels = {};
  //     this.Genie.WebChannels.load_channels = () => {
  //         let port = this.Genie.Settings.websockets_port;
  //         // let port = this.Genie.Settings.websockets_port == this.Genie.Settings.server_port ? window.location.port : this.Genie.Settings.websockets_port;
  //         var socket = new WebSocket(window.location.protocol.replace("http", "ws") + '//' + window.location.hostname + ':' + port);
  //         var channels = this.Genie.WebChannels;

  //         channels.channel = socket;
  //         channels.sendMessageTo = sendMessageTo;

  //         channels.messageHandlers = [];
  //         channels.errorHandlers = [];
  //         channels.openHandlers = [];
  //         channels.closeHandlers = [];

  //         socket.addEventListener('open', function (event) {
  //             for (var i = 0; i < channels.openHandlers.length; i++) {
  //                 var f = channels.openHandlers[i];
  //                 if (typeof f === 'function') {
  //                     f(event);
  //                 }
  //             }
  //         });
  //         socket.addEventListener('message', function (event) {
  //             for (var i = 0; i < channels.messageHandlers.length; i++) {
  //                 var f = channels.messageHandlers[i];
  //                 if (typeof f === 'function') {
  //                     f(event);
  //                 }
  //             }
  //         });
  //         socket.addEventListener('error', function (event) {
  //             for (var i = 0; i < channels.errorHandlers.length; i++) {
  //                 var f = channels.errorHandlers[i];
  //                 if (typeof f === 'function') {
  //                     f(event);
  //                 }
  //             }
  //         });

  //         socket.addEventListener('close', function (event) {
  //             for (var i = 0; i < channels.closeHandlers.length; i++) {
  //                 var f = channels.closeHandlers[i];
  //                 if (typeof f === 'function') {
  //                     f(event);
  //                 }
  //             }
  //         });
  //         // A message maps to a channel route so that channel + message = /action/controller
  //         // The payload is the data exposed in the Channel Controller
  //         function sendMessageTo(channel: string, message: any, payload = {}) {
  //             if (socket.readyState === 1) {
  //                 socket.send(JSON.stringify({
  //                     'channel': channel,
  //                     'message': message,
  //                     'payload': payload
  //                 }));
  //             }
  //             else {
  //                 console.log('message not sent')
  //             }
  //         }

  //     }

  //     this.Genie.WebChannels.load_channels();


  //     this.Genie.WebChannels.errorHandlers.push(function (event: any) {
  //         console.log(event.data);
  //     });

  //     this.Genie.WebChannels.closeHandlers.push(() => {
  //         console.log("Server closed WebSocket connection");
  //     });

  //     this.Genie.WebChannels.openHandlers.push(() => {
  //         if (this.Genie.Settings.webchannels_autosubscribe) {
  //             this.subscribe();
  //         }
  //     });

  //     // this.subscribe()
  // };


  // initHandlers(parse_payload: Function) {
  //     this.Genie.WebChannels.messageHandlers.push(function (event:any) {
  //         try {
  //             if (event.data.startsWith('{') && event.data.endsWith('}')) {
  //                 parse_payload(JSON.parse(event.data, function (key, value) {
  //                     if (value == "__undefined__") {
  //                         return undefined;
  //                     } else {
  //                         return value;
  //                     }
  //                 }));
  //             } else {
  //                 parse_payload(event.data);
  //             }
  //         } catch (ex) {
  //             console.log(ex);
  //         }
  //     });
  // }

  // subscribe() {
  //     if (document.readyState === "complete" || document.readyState === "interactive") {
  //         this.Genie.WebChannels.sendMessageTo(this.Genie.Settings.webchannels_default_route, this.Genie.Settings.webchannels_subscribe_channel);
  //         console.log("Subscription ready");
  //     } else {
  //         console.log("Queuing subscription");
  //         setTimeout(this.subscribe, 1000);
  //     }
  // };

  // unsubscribe() {
  //     this.Genie.WebChannels.sendMessageTo(this.Genie.Settings.webchannels_default_route, this.Genie.Settings.webchannels_unsubscribe_channel);
  //     console.log("Unsubscription completed");
  // };
}
