import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [ id: string] :{
        socket: Socket,
        user: User
        
    }
}

@Injectable()
export class MessageWsService {

    private connectedClients : ConnectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){};

    async registerClient(client: Socket, userId:string) {

        const user = await this.userRepository.findOneBy({id: userId});
        if ( !user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User not active');

        this.checkUserConection(user);

        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        }

    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }


    getConnectionClients(): string[] {
        console.log(this.connectedClients)
        return Object.keys( this.connectedClients);
    }


    getUserFullName ( socketId: string) {
        return this.connectedClients[socketId].user.fullName
    }

    private checkUserConection( user: User){

        for (const cliendId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[cliendId];

            if( connectedClient.user.id === user.id){
                connectedClient.socket.disconnect();
                break;
            }
            
        }
    }

}
