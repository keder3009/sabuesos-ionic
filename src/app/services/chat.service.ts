import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage, DataChat, IChat } from '../pages/chat/types/chat.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  // private _chat$ = new BehaviorSubject<IChat[]>([]);
  // public chat$ = this._chat$.asObservable();

  private _baseUrl = environment.api + '/chat';
  constructor(private http: HttpClient, private authService: AuthService, private socket: Socket) {

  }

  async createChat(dataChat: DataChat): Promise<IChat> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .post<IChat>(`${this._baseUrl}`, dataChat, { headers })
      .toPromise();
  }

  async checkIfChatExist(dataChat: DataChat): Promise<IChat> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IChat>(`${this._baseUrl}/${dataChat.post}/checkIfExist/${dataChat.userSend}/${dataChat.userReceived}`, { headers })
      .toPromise();
  }

  async getMessagesPrevious(idChat: string): Promise<IChat> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IChat>(`${this._baseUrl}/${idChat}/findMessagesByChat`, { headers })
      .toPromise();
  }

  async getAllChats(idUser: string): Promise<any[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .get<IChat[]>(`${this._baseUrl}/${idUser}/getAllChats`, { headers })
      .toPromise();
  }

  async deleteChat(idChat: string): Promise<IChat[]> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .delete<IChat[]>(`${this._baseUrl}/${idChat}`, { headers })
      .toPromise();
  }

  async addMessages(id: string, message: ChatMessage): Promise<IChat> {
    let headers = new HttpHeaders();
    await headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS'])
    return await this.http
      .put<IChat>(`${this._baseUrl}/${id}`, message, { headers })
      .toPromise();
  }

  joinRoom(chatId: string): void {
    try {
      this.socket.emit('event_join', chatId);
    } catch (error) {

    }
  }

  sendMessage(payload: { message: ChatMessage, room: string }) {
    try {
      this.socket.emit('send_message', payload);
    } catch (error) {
      console.error(error)
    }
  }

  leaveRoom(room: string): void {
    this.socket.emit('event_leave', room);
  }

  getMessage(): Observable<ChatMessage> {
    return this.socket.fromEvent('new_message');
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

}
