import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-add-question-in-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-question-in-test.html',
  styleUrls: ['./add-question-in-test.scss']
})
export class AddQuestionInTest {

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  id: number | null = null;
  questionId: number | null = null;
  questionForm!: FormGroup;
  @ViewChild('questionInput') questionInput!: ElementRef;
  @ViewChild('imageInput') imageInput?: ElementRef<HTMLInputElement>;
  isEditMode = false;
  selectedImageFile: File | null = null;
  hasExistingImage = false;
  existingImageUrl: string | null = null;
  removeCurrentImage = false;
  apiBaseUrl = '';

  ngOnInit() {
    this.apiBaseUrl = this.adminService.getApiBaseUrl();

    this.questionForm = this.fb.group({
      questionText: [null, [Validators.required]],
      optionA: [null],
      optionB: [null],
      optionC: [null],
      optionD: [null],
      correctOption: [null, [Validators.required]],
      questionType: ['MULTIPLE_CHOICE', [Validators.required]],
      explanation: [null]
    });

    const idParam = this.activatedRoute.snapshot.params['id'];
    const qIdParam = this.activatedRoute.snapshot.params['questionId'];

    this.id = idParam ? +idParam : null;
    this.questionId = qIdParam ? +qIdParam : null;

    if (this.questionId) {
      this.isEditMode = true;
      this.loadQuestion();
    }

    this.questionForm.get('questionType')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  updateValidators(type: string) {
    const options = ['optionA', 'optionB', 'optionC', 'optionD'];
    if (type === 'MULTIPLE_CHOICE') {
      options.forEach(opt => this.questionForm.get(opt)?.setValidators([Validators.required]));
    } else {
      options.forEach(opt => this.questionForm.get(opt)?.clearValidators());
    }
    options.forEach(opt => this.questionForm.get(opt)?.updateValueAndValidity());
  }

  loadQuestion() {
    if (!this.questionId) {
      return;
    }

    this.adminService.getQuestionById(this.questionId).subscribe(res => {
      this.questionForm.patchValue(res);
      this.hasExistingImage = !!res?.hasImage;
      this.existingImageUrl = res?.imageUrl ?? null;
      this.removeCurrentImage = false;
      this.selectedImageFile = null;
      if (this.imageInput) {
        this.imageInput.nativeElement.value = '';
      }
    });
  }

  goBack() {
    this.router.navigateByUrl(`/admin/view-test/${this.id}`);
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;

    if (!file) {
      this.selectedImageFile = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.selectedImageFile = null;
      target.value = '';
      this.notification.error('Қате', 'Only image files are allowed', { nzDuration: 5000 });
      return;
    }

    this.selectedImageFile = file;
    this.removeCurrentImage = false;
  }

  onRemoveImageToggle(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.removeCurrentImage = checked;
    if (checked) {
      this.selectedImageFile = null;
      if (this.imageInput) {
        this.imageInput.nativeElement.value = '';
      }
    }
  }

  submitForm() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const questionFormData = this.buildQuestionFormData();

    if (this.isEditMode) {
      this.adminService.updateQuestionWithImage(this.questionId!, questionFormData).subscribe(() => {
        this.notification.success('Сәтті', 'Сұрақ сәтті жаңартылды', { nzDuration: 5000 });
        this.router.navigateByUrl(`/admin/view-test/${this.id}`);
      }, error => {
        this.notification.error('Қате', this.extractErrorMessage(error, 'Жүктеу кезінде қате кетті'), { nzDuration: 5000 });
      });
      return;
    }

    this.adminService.addQuestionInTestWithImage(questionFormData).subscribe(() => {
      this.notification.success('Сәтті', 'Сұрақ сәтті қосылды! Келесі сұрақты жаза беріңіз.', { nzDuration: 3000 });

      const currentType = this.questionForm.get('questionType')?.value;
      this.questionForm.reset({
        questionType: currentType,
        questionText: null,
        optionA: null,
        optionB: null,
        optionC: null,
        optionD: null,
        correctOption: null,
        explanation: null
      });

      this.selectedImageFile = null;
      this.removeCurrentImage = false;
      if (this.imageInput) {
        this.imageInput.nativeElement.value = '';
      }

      if (this.questionInput) {
        this.questionInput.nativeElement.focus();
      }
    }, error => {
      this.notification.error('Қате', this.extractErrorMessage(error, 'Қосу кезінде қате кетті'), { nzDuration: 5000 });
    });
  }

  private buildQuestionFormData(): FormData {
    const value = this.questionForm.value;
    const formData = new FormData();

    if (this.id !== null) {
      formData.append('testId', String(this.id));
    }

    this.appendIfPresent(formData, 'questionText', value.questionText);
    this.appendIfPresent(formData, 'optionA', value.optionA);
    this.appendIfPresent(formData, 'optionB', value.optionB);
    this.appendIfPresent(formData, 'optionC', value.optionC);
    this.appendIfPresent(formData, 'optionD', value.optionD);
    this.appendIfPresent(formData, 'correctOption', value.correctOption);
    this.appendIfPresent(formData, 'explanation', value.explanation);
    this.appendIfPresent(formData, 'questionType', value.questionType);

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    if (this.isEditMode) {
      formData.append('removeImage', String(this.removeCurrentImage && !this.selectedImageFile));
    }

    return formData;
  }

  private appendIfPresent(formData: FormData, key: string, value: unknown): void {
    if (value === null || value === undefined) {
      return;
    }

    const normalized = String(value).trim();
    if (normalized.length === 0) {
      return;
    }

    formData.append(key, normalized);
  }

  private extractErrorMessage(error: any, fallback: string): string {
    const rawError = error?.error;

    if (typeof rawError === 'string' && rawError.trim()) {
      return rawError;
    }

    if (typeof rawError?.message === 'string' && rawError.message.trim()) {
      return rawError.message;
    }

    if (typeof rawError?.error === 'string' && rawError.error.trim()) {
      return rawError.error;
    }

    if (typeof error?.message === 'string' && error.message.trim()) {
      return error.message;
    }

    return fallback;
  }

  resolveImageUrl(imageUrl: string | null | undefined): string {
    if (typeof imageUrl === 'string' && imageUrl.trim()) {
      if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
      }
      const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
      const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      return `${baseUrl}${normalizedPath}`;
    }

    if (this.questionId) {
      const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
      return `${baseUrl}/api/test/question/${this.questionId}/image`;
    }

    return '';
  }
}
