import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { SocketioService } from './services/socketio.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chat-bot-ui';
  message;
  destroy$ = new Subject();
  sentMessages = [];
  incomingMessages = [];
  constructor(private socketService: SocketioService) {
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.consumeMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.incomingMessages = [...res];
      });
  }

  sendMessage(): void {
    if (this.message) {
      this.sentMessages.push(this.message);
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
