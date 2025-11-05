import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AdminService } from '../../../admin/services/admin';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {

  tests = [];

  constructor(
    private notification: NzNotificationService,
    private testService: AdminService
  ){}

  ngOnInit() {
    this.getAllTests();
  }

  getAllTests() {
    this.testService.getAllTest().subscribe(res => {
      this.tests = res;
    }, error => {
      this.notification.error(
        'Қате',
        'Бірдеңе қате кетті. Қайта көріңіз',
        { nzDuration: 5000 }
      );
    });
  }

  getFormattedTime(time): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes} минут ${seconds} секунд`;
  }

}
