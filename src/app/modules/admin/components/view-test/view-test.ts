import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-view-test',
  imports: [SharedModule],
  templateUrl: './view-test.html',
  styleUrl: './view-test.scss'
})
export class ViewTest {

  testData: any;
  questions: any[] = [];
  testId: any;

  constructor(private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');
      this.getTestDetails();
    })
  }

  getTestDetails() {
    this.adminService.getTestQuestions(this.testId).subscribe(res => {
      this.testData = res.testDTO;
      this.questions = res.questions;
    })
  }

  deleteQuestion(questionId: number) {
    if (confirm('Осы сұрақты жоюға сенімдісіз бе?')) {
      this.adminService.deleteQuestion(questionId).subscribe(res => {
        this.notification.success('Сәтті', 'Сұрақ жойылды', { nzDuration: 4000 });
        this.getTestDetails();
      }, error => {
        this.notification.error('Қате', `${error.error}`, { nzDuration: 4000 });
      });
    }
  }

}