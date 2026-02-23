import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TestService } from '../dashboard/services/test';
import { UserStorage } from '../../../auth/signup/services/user-storage';

@Component({
  selector: 'app-take-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './take-test.html',
  styleUrls: ['./take-test.scss']
})
export class TakeTest {

  questions: any[] = [];
  testId: any;
  apiBaseUrl = '';

  selectedAnswers: { [key: number]: string } = {};

  timeRemaining: number = 0;
  interval: any;
  currentQuestionIndex: number = 0;

  isSubmitted = false;

  constructor(
    private testService: TestService,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.apiBaseUrl = this.testService.getApiBaseUrl();

    this.activatedRoute.paramMap.subscribe(params => {
      this.testId = +params.get('id');

      this.testService.getTestQuestions(this.testId).subscribe(res => {
        this.questions = res.questions;
        // Переводим время в секунды, если бэкенд присылает в минутах (уточните формат)
        // Если бэкенд шлет секунды, оставляем так:
        this.timeRemaining = res.testDTO.time || 0;
        this.startTimer();
      })
    })
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startTimer() {
    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.interval);
        if (!this.isSubmitted) {
          this.message.warning('Уақыт аяқталды! Тест автоматты түрде жіберіледі.');
          this.submitAnswers();
        }
      }
    }, 1000)
  }

  getFormattedTime(): string {
    const hours = Math.floor(this.timeRemaining / 3600);
    const minutes = Math.floor((this.timeRemaining % 3600) / 60);
    const seconds = this.timeRemaining % 60;

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onAnswerChange(questionId: number, selectedOption: string) {
    if (this.isSubmitted) return;
    this.selectedAnswers[questionId] = selectedOption;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.triggerAnimation();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.triggerAnimation();
    }
  }

  isAnimating = false;
  triggerAnimation() {
    this.isAnimating = true;
    setTimeout(() => this.isAnimating = false, 500);
  }

  getProgress(): number {
    if (this.questions.length === 0) return 0;
    return Math.floor((Object.keys(this.selectedAnswers).length / this.questions.length) * 100);
  }

  submitAnswers() {
    if (this.isSubmitted) return;
    this.isSubmitted = true;

    if (this.interval) clearInterval(this.interval);

    const answerList = Object.keys(this.selectedAnswers).map(questionId => {
      return {
        questionId: +questionId,
        selectedOption: this.selectedAnswers[questionId]
      }
    })

    const data = {
      testId: this.testId,
      userId: UserStorage.getUserID(),
      responses: answerList
    }

    this.testService.submitTest(data).subscribe(res => {
      this.message.success('Тест сәтті жіберілді!', { nzDuration: 5000 });
      this.router.navigateByUrl("/user/result-detail/" + res.id);
    }, error => {
      this.isSubmitted = false; // Позволяем попробовать еще раз при ошибке
      this.message.error(`${error.error}`, { nzDuration: 5000 });
    });
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
