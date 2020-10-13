import { Injectable } from '@angular/core';
import { Email } from '../shared/email';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { }

  postSendmailOnePlayer(email: Email) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Email>(this.configService.baseURL + "sendmail/", email, httpOptions).pipe(catchError(this.processHttpMsgService.handleError));
  }

}
