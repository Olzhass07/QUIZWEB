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
  apiBaseUrl = '';

  constructor(private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
    this.apiBaseUrl = this.adminService.getApiBaseUrl();

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

  resolveImageUrl(question: any): string {
    const imageUrl = question?.imageUrl;
    if (typeof imageUrl === 'string' && imageUrl.trim()) {
      if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
      }
      const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
      const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
      return `${baseUrl}${normalizedPath}`;
    }

    const questionId = question?.id ?? question?.questionId;
    if (questionId) {
      const baseUrl = this.apiBaseUrl.replace(/\/+$/, '');
      return `${baseUrl}/api/test/question/${questionId}/image`;
    }

    return '';
  }

}
