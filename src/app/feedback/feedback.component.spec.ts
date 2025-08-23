import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FeedbackComponent,
  IFeedbackDynamoDbRecord,
} from './feedback.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { CommonService } from '../service/common/common.service';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let mockService: jasmine.SpyObj<CommonService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('CommonService', [
      'healthCheck',
      'submiteFeedbackForm',
      'getFeedbacks',
    ]);

    mockService.healthCheck.and.returnValue(of({ status: 'OK' }));
    mockService.getFeedbacks.and.returnValue(of({ status: 'OK', body: [] }));

    await TestBed.configureTestingModule({
      imports: [
        FeedbackComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
      ],
      providers: [{ provide: CommonService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call healthCheck on init', () => {
    expect(mockService.healthCheck).toHaveBeenCalled();
  });

  it('should call getFeedbackList on init', () => {
    expect(mockService.getFeedbacks).toHaveBeenCalledWith(
      component.sortBy,
      component.sortDirection,
    );
  });

  it('setRating should update selectedRating and form control', () => {
    component.setRating(4);
    expect(component.selectedRating).toBe(4);
    expect(component.getControl('rating')?.value).toBe(4);
  });

  it('onSubmit should not call backend if form invalid', () => {
    component.feedbackForm.setValue({ name: '', message: '', rating: 0 });
    component.onSubmit();
    expect(mockService.submiteFeedbackForm).not.toHaveBeenCalled();
  });

  it('onSubmit should call backend if form valid', () => {
    const formData = { name: 'Test', message: 'Hello', rating: 5 };
    component.feedbackForm.setValue(formData);
    mockService.submiteFeedbackForm.and.returnValue(of({ status: 'OK' }));

    component.onSubmit();

    expect(mockService.submiteFeedbackForm).toHaveBeenCalledWith(formData);
  });

  it('getFeedbackList should populate feedbackList on success', () => {
    const mockFeedback: IFeedbackDynamoDbRecord[] = [
      {
        id: '1',
        name: 'Test Name',
        message: 'Test Message',
        rating: 5,
        category: 'General',
        timestamp: Date.now(),
      },
    ];
    mockService.getFeedbacks.and.returnValue(
      of({ status: 'OK', body: mockFeedback }),
    );

    component.getFeedbackList();

    expect(component.feedbackList).toEqual(mockFeedback);
  });

  it('getFeedbackList should handle error', () => {
    spyOn(window, 'alert');
    mockService.getFeedbacks.and.returnValue(
      throwError(() => new Error('Server error')),
    );

    component.getFeedbackList();

    expect(window.alert).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again later.',
    );
  });
});
