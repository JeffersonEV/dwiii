import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BannerResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BannerService {
  constructor(private http: HttpClient) {}

  listar(): Observable<BannerResponse[]> {
    return this.http.get<BannerResponse[]>(`${environment.apiUrl}/banners`);
  }
}
