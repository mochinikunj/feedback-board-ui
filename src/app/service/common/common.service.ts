import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import {
  ICreateFeedbackRequest,
  SortBy,
  SortDirection,
} from '../../feedback/feedback.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  healthCheck(): Observable<object> {
    const endPoint = `${environment.nodeUrl}/health-check`;
    return this.http.get(endPoint);
  }

  submiteFeedbackForm(request: ICreateFeedbackRequest): Observable<object> {
    const endPoint = `${environment.nodeUrl}/feedback`;
    return this.http.post(endPoint, request);
  }

  getFeedbacks(
    sortBy: SortBy,
    sortDirection: SortDirection,
  ): Observable<object> {
    let endPoint = `${environment.nodeUrl}/feedback?sortBy=${sortBy}&descendingSort=${sortDirection}`;
    return this.http.get(endPoint);
  }
}
