import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../service/common/common.service';

export interface ICreateFeedbackRequest {
  name: string;
  message: string;
  rating: number;
}

export interface IFeedbackDynamoDbRecord extends ICreateFeedbackRequest {
  category: string;
  id: string;
  timestamp: number;
}

export enum SortBy {
  DATE = 'date',
  RATING = 'rating',
}

export enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  selectedRating = 0;
  isSubmitting = false;
  feedbackList: IFeedbackDynamoDbRecord[] = [];
  sortBy = SortBy.DATE;
  sortDirection = SortDirection.DESCENDING;

  constructor(
    private fb: FormBuilder,
    private common: CommonService,
  ) {
    // initializing form builder and controls
    this.feedbackForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2000),
        ],
      ],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit() {
    this.getFeedbackList();
  }

  getControl(formKey: string): AbstractControl | null {
    return this.feedbackForm.get(formKey);
  }

  setRating(rating: number) {
    this.selectedRating = rating;

    const ctrl = this.getControl('rating');
    ctrl?.setValue(rating);
    ctrl?.markAsDirty();
    ctrl?.markAsTouched();
  }

  async onSubmit() {
    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitFormToBackend(this.feedbackForm.value);
  }

  submitFormToBackend(request: ICreateFeedbackRequest) {
    this.common.submiteFeedbackForm(request).subscribe({
      next: (response: any) => {
        if (response && response.status === 'OK') {
          alert('Form Submitted Successfully.');
          this.resetContactForm();
          this.getFeedbackList();
        }
      },
      error: (err) => {
        alert('An unexpected error occurred. Please try again later.');
        this.resetContactForm();
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  resetContactForm() {
    this.feedbackForm.reset();
  }

  getFeedbackList() {
    this.common.getFeedbacks(this.sortBy, this.sortDirection).subscribe({
      next: (response: any) => {
        if (response && response.status === 'OK') {
          this.feedbackList = response?.body ?? [];
        }
      },
      error: (err) => {
        alert('An unexpected error occurred. Please try again later.');
      },
      complete: () => {
        console.log('Successfully fetched feedback list...');
      },
    });
  }
}
