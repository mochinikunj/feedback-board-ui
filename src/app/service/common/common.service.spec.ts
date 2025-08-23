import { TestBed } from '@angular/core/testing';
import { CommonService } from './common.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
  ICreateFeedbackRequest,
  SortBy,
  SortDirection,
} from '../../feedback/feedback.component';

describe('CommonService', () => {
  let service: CommonService;
  let httpSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        CommonService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'HttpClient', useValue: httpSpy },
      ],
    });

    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('healthCheck should call http.get', () => {
    httpSpy.get.and.returnValue(of({ status: 'ok' }));

    service.healthCheck().subscribe((res) => {
      expect(res).toEqual({ status: 'ok' });
    });
  });

  it('submiteFeedbackForm should call http.post', () => {
    const mockRequest: ICreateFeedbackRequest = {
      name: 'Nikunj',
      message: 'Great job!',
      rating: 5,
    };
    httpSpy.post.and.returnValue(of({ success: true }));

    service.submiteFeedbackForm(mockRequest).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });
  });

  it('getFeedbacks should call http.get with query params', () => {
    httpSpy.get.and.returnValue(of({ data: [] }));

    service
      .getFeedbacks(SortBy.RATING, SortDirection.ASCENDING)
      .subscribe((res) => {
        expect(res).toEqual({ data: [] });
      });
  });
});
