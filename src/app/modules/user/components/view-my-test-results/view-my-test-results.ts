import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { TestService } from '../dashboard/services/test';

@Component({
  selector: 'app-view-my-test-results',
  imports: [SharedModule],
  templateUrl: './view-my-test-results.html',
  styleUrl: './view-my-test-results.scss'
})
export class ViewMyTestResults {

  dataSet: any;
  
  constructor(private testService: TestService) {}

  ngOnInit() {
    this.getTestResults();
  }

  getTestResults() {
    this.testService.getMyTestResults().subscribe(res => {
      this.dataSet = res;
      console.log(this.dataSet);
    })
  }
}
