import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-signup',
  imports: [SharedModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  validateForm!: FormGroup;
  passwordVisible = false;

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private authservice: Auth
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      age: [null, [Validators.required, Validators.min(1)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
      ]],
      confirmPassword: [null, [Validators.required]],
    }, { validator: this.confirmationValidator });
  }

  regexUpper = /[A-Z]/;
  regexLower = /[a-z]/;
  regexDigit = /[0-9]/;
  regexSpecial = /[@#$%^&+=!]/;

  confirmPasswordVisible = false;

  get password() { return this.validateForm.get('password'); }

  checkRequirement(regex: RegExp): boolean {
    return regex.test(this.password?.value || '');
  }

  confirmationValidator = (group: FormGroup): { [s: string]: boolean } => {
    if (!group.get('password') || !group.get('confirmPassword')) {
      return null;
    }
    return group.get('password').value === group.get('confirmPassword').value
      ? null : { mismatch: true };
  };

  submitForm() {
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }
    const signupData = { ...this.validateForm.value };

    this.authservice.register(signupData).subscribe(res => {
      this.message
        .success(
          `Тіркелу сәтті өтті`,
          { nzDuration: 5000 }
        );
      this.router.navigateByUrl("/login");
    }, error => {
      this.message
        .error(
          `${error.error}`,
          { nzDuration: 5000 }
        )
    })
  }

}
