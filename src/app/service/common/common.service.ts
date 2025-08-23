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
    sortBy = SortBy.DATE,
    sortDirection = SortDirection.DESCENDING,
  ): Observable<object> {
    let endPoint = `${environment.nodeUrl}/feedback`;

    if (sortBy && sortDirection) {
      endPoint += `?sortBy=${sortBy}&descendingSort=${sortDirection}`;
    } else if (sortBy) {
      endPoint += `?sortBy=${sortBy}`;
    } else if (sortDirection) {
      endPoint += `?descendingSort=${sortDirection}`;
    }

    return this.http.get(endPoint);
  }
}
