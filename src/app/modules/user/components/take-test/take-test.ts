import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../../admin/services/admin';

@Component({
  selector: 'app-take-test',
  imports: [SharedModule],
  templateUrl: './take-test.html',
  styleUrls: ['./take-test.scss']
})
export class TakeTest {

  questions: any[] = [];
  testId: any;

  constructor(
    private testService: AdminService,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router
  ){}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');

      this.testService.getTestQuestions(this.testId).subscribe(res => {
        this.questions = res.questions;
        console.log(this.questions);
      });
    });
  }

}