import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Auth } from '../signup/services/auth';
import { UserStorage as UserStorageService } from '../signup/services/user-storage';

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
    private userStorage: UserStorageService
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  passwordVisible = false;

  submitForm(): void {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.validateForm.value).subscribe({
      next: (res) => {
        this.message.success('Сәтті кіру', { nzDuration: 5000 });

        const user = {
          id: res.id,
          role: res.role
        };

        this.userStorage.saveUser(user);

        if (user.role && String(user.role).toUpperCase() === 'ADMIN') {
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.router.navigateByUrl('/user/dashboard');
        }
      },
      error: (err) => {
        this.message.error(err.error || 'Қате деректер', { nzDuration: 5000 });
      }
    });
  }
}
