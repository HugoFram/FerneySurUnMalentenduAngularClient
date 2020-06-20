import { Injectable } from '@angular/core';
import { Room } from '../shared/room';
import { ROOMS } from '../shared/rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor() { }

  getRooms(): Room[] {
    return ROOMS;
  }

  getPlayer(id: number): Room {
    return ROOMS.filter(room => room.id === id)[0];
  }
}
