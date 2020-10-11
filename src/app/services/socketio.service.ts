import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  private consumeSocket$: BehaviorSubject<Array<string>> = new BehaviorSubject([]);
  constructor() { }

  setupSocketConnection(): void {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.on('broadcast', (data: string) => {
      let value = this.consumeSocket$.value;
      value = [
        ...value,
        data
      ];
      this.consumeSocket$.next(value);
    });
  }

  sendMessage(message): void {
    this.socket.emit('message', message);
  }

  consumeMessages(): BehaviorSubject<Array<string>> {
    return this.consumeSocket$;
  }

}
