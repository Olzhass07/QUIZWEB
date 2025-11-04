import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-view-test-results',
  imports: [SharedModule],
  templateUrl: './view-test-results.html',
  styleUrl: './view-test-results.scss'
})
export class ViewTestResults {
  resultsData: any;

  constructor(private testService: AdminService) {}


  ngOnInit() {
    this.getTestResults();
  }

  getTestResults() {
    this.testService.getTestResults().subscribe(res => {
      this.resultsData = res;
      console.log(this.resultsData);
    });
  }

}
