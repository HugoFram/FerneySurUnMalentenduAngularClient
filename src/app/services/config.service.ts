import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  baseURL: string;
  appURL: string;
  constructor() { }
}
