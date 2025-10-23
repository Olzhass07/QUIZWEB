import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [SharedModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  constructor(private fb: FormBuilder, 
    private message: NzMessageService,
    private router: Router
  ) {}


  validateForm!: FormGroup;

  ngOnInit(){
    this.validateForm = this.fb.group({
     email: [null, [Validators.required, Validators.email]],
     password : [null, [Validators.required]],
     name : [null, [Validators.required]],
  }
    );
}

submitForm(){
  
}

 }
