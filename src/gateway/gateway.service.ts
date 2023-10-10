import {Injectable, OnModuleInit} from '@nestjs/common';
import {io, Socket} from "socket.io-client";

@Injectable()
export class GatewayService implements OnModuleInit {
    public socketClient: Socket;

    constructor() {
        this.socketClient = io('http://localhost:3001');
    }

    onModuleInit() {
        this.registerConsumerEvents();
    }

    private registerConsumerEvents() {
        this.socketClient.emit('newMessage', {msg: 'New Message fulo here'})
        this.socketClient.on('connect', () => {
            console.log('Connected');
        })
        this.socketClient.on('onMessage', (payload: any) => {
            console.log(payload);
            console.log('service');
        })
    }
}
