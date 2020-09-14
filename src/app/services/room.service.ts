import { Injectable } from '@angular/core';
import { Room } from '../shared/room';
import { ROOMS } from '../shared/rooms';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService) { }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(baseURL + "locations").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getRoom(address: string): Room {
    return ROOMS.filter(room => room.address === address)[0];
  }
}
