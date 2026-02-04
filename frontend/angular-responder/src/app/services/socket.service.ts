import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private url = 'http://localhost:3003';

    constructor() {
        this.socket = io(this.url);
        this.socket.on('connect', () => {
            console.log('✅ Connected to WebSocket Hub');
        });
    }

    onEvent(eventName: string): Observable<any> {
        return new Observable(observer => {
            this.socket.on(eventName, (data) => {
                observer.next(data);
            });
        });
    }
}
