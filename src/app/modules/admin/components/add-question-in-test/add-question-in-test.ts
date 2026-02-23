import { Component, ViewChild, ElementRef } from '@angular/core';
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
  isEditMode = false;

  ngOnInit() {
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

    // Convert strings from route to numbers immediately
    const idParam = this.activatedRoute.snapshot.params['id'];
    const qIdParam = this.activatedRoute.snapshot.params['questionId'];

    this.id = idParam ? +idParam : null;
    this.questionId = qIdParam ? +qIdParam : null;

    if (this.questionId) {
      this.isEditMode = true;
      this.loadQuestion();
    }

    this.questionForm.get('questionType').valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
  }

  updateValidators(type: string) {
    const options = ['optionA', 'optionB', 'optionC', 'optionD'];
    if (type === 'MULTIPLE_CHOICE') {
      options.forEach(opt => this.questionForm.get(opt).setValidators([Validators.required]));
    } else {
      options.forEach(opt => this.questionForm.get(opt).clearValidators());
    }
    options.forEach(opt => this.questionForm.get(opt).updateValueAndValidity());
  }

  loadQuestion() {
    if (this.questionId) {
      this.adminService.getQuestionById(this.questionId).subscribe(res => {
        this.questionForm.patchValue(res);
      });
    }
  }

  goBack() {
    this.router.navigateByUrl(`/admin/view-test/${this.id}`);
  }

  submitForm() {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }
    const questionDto = this.questionForm.value;
    questionDto.testId = this.id; // Test ID from URL

    if (this.isEditMode) {
      questionDto.id = this.questionId; // Question ID from URL
      this.adminService.updateQuestion(this.questionId!, questionDto).subscribe(res => {
        this.notification.success('Сәтті', 'Сұрақ сәтті жаңартылды', { nzDuration: 5000 });
        this.router.navigateByUrl(`/admin/view-test/${this.id}`);
      }, error => {
        this.notification.error('Қате', error.error || 'Жүктеу кезінде қате кетті', { nzDuration: 5000 });
      });
    } else {
      this.adminService.addQuestionInTest(questionDto).subscribe(res => {
        this.notification.success('Сәтті', 'Сұрақ сәтті қосылды! Келесі сұрақты жаза беріңіз.', { nzDuration: 3000 });

        const currentType = this.questionForm.get('questionType').value;
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

        if (this.questionInput) {
          this.questionInput.nativeElement.focus();
        }
      }, error => {
        this.notification.error('Қате', error.error || 'Қосу кезінде қате кетті', { nzDuration: 5000 });
      });
    }
  }
}
