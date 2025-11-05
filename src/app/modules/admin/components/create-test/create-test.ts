import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.scss']
})
export class CreateTest {
  testForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private devicesService: AdminService,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.testForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });
  }

  submitForm() {
    if (this.testForm.valid) {
      this.devicesService.createTest(this.testForm.value).subscribe({
        next: (res) => {
          this.notification.success(
            'Сәтті',
            'Тест сәтті құрылды',
            { nzDuration: 5000 }
          );
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (error) => {
          this.notification.error(
            'Қате',
            `${error.error}`,
            { nzDuration: 5000 }
          );
        }
      });
    }
  }
}
