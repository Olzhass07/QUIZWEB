import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-create-test',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './create-test.html',
  styleUrls: ['./create-test.scss']
})
export class CreateTest {
  testForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.testForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, [Validators.required]],
      time: [null, [Validators.required]],
    });
  }
}