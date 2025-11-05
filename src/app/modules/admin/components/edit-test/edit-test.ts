import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-edit-test',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './edit-test.html',
  styleUrls: ['./edit-test.scss']
})
export class EditTest {
  testForm!: FormGroup;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.testForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });

    this.route.paramMap.subscribe((params) => {
      this.id = +(params.get('id') || 0);
      if (this.id) {
        this.loadTest();
      }
    });
  }

  loadTest() {
    // Reuse existing API: returns questions and testDTO
    this.adminService.getTestQuestions(this.id).subscribe({
      next: (res) => {
        const dto = res.testDTO || res; // fallback if backend returns direct object
        if (dto) {
          this.testForm.patchValue({
            title: dto.title,
            description: dto.description,
            time: dto.time,
          });
        }
      },
      error: (err) => {
        this.notification.error('Қате', `${err.error || 'Тестті жүктеу қатесі'}`, { nzDuration: 5000 });
      }
    })
  }

  submitForm() {
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      return;
    }
    this.adminService.updateTest(this.id, this.testForm.value).subscribe({
      next: () => {
        this.notification.success('Сәтті', 'Тест сәтті жаңартылды', { nzDuration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      error: (err) => {
        this.notification.error('Қате', `${err.error || 'Жаңарту кезінде қате'}`, { nzDuration: 5000 });
      }
    })
  }
}

