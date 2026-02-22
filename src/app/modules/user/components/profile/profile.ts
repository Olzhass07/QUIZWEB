import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { Auth } from '../../../auth/signup/services/auth';
import { UserStorage } from '../../../auth/signup/services/user-storage';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './profile.html',
    styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
    profileData: any = { testsTaken: 0, averageScore: 0, testResults: [] };
    profileForm!: FormGroup;
    passwordForm!: FormGroup;
    userId: string = UserStorage.getUserID();
    passwordVisible = false;
    newPasswordVisible = false;
    confirmPasswordVisible = false;

    constructor(
        private fb: FormBuilder,
        private authService: Auth,
        private message: NzMessageService,
        private notification: NzNotificationService
    ) { }

    ngOnInit() {
        this.profileForm = this.fb.group({
            name: [null, [Validators.required]],
            age: [null, [Validators.required, Validators.min(1)]]
        });

        this.passwordForm = this.fb.group({
            userId: [this.userId],
            oldPassword: [null, [Validators.required]],
            newPassword: [null, [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
            ]],
            confirmPassword: [null, [Validators.required]]
        }, { validator: this.confirmationValidator });

        this.loadProfile();
    }

    loadProfile() {
        this.authService.getProfile(this.userId).subscribe(res => {
            if (res) {
                this.profileData = { ...this.profileData, ...res };
                this.profileForm.patchValue({
                    name: res.name || '',
                    age: res.age || null
                });
            }
        });
    }

    updateProfile() {
        if (this.profileForm.valid) {
            this.authService.updateProfile(this.userId, this.profileForm.value).subscribe(res => {
                this.message.success('Профиль сәтті жаңартылды!');
                this.loadProfile();
            });
        }
    }

    changePassword() {
        if (this.passwordForm.valid) {
            this.authService.changePassword(this.passwordForm.value).subscribe(res => {
                this.message.success('Құпиясөз сәтті өзгертілді!');
                this.passwordForm.reset({ userId: this.userId });
            }, error => {
                this.message.error(error.error || 'Құпиясөзді өзгерту кезінде қате');
            });
        }
    }

    confirmationValidator = (group: FormGroup): { [s: string]: boolean } => {
        if (!group.get('newPassword') || !group.get('confirmPassword')) {
            return null;
        }
        return group.get('newPassword').value === group.get('confirmPassword').value
            ? null : { mismatch: true };
    };
}
