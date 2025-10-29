import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Auth } from '../signup/services/auth';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private message: NzMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.validateForm.value).subscribe({
      next: (res) => {
        this.message.success('Login successful! Welcome back.', { nzDuration: 5000 });
        // Optionally navigate after login
        // this.router.navigate(['/']);
        console.log(res);
      },
      error: (err) => {
        this.message.error('Login failed. Please try again.', { nzDuration: 5000 });
        console.error(err);
      }
    });
  }
}
