import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../dashboard/services/test';

@Component({
    selector: 'app-result-detail',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './result-detail.html',
    styleUrls: ['./result-detail.scss']
})
export class ResultDetail {
    resultData: any;
    resultId: any;

    constructor(
        private testService: TestService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.resultId = this.activatedRoute.snapshot.params['id'];
        this.getDetails();
    }

    getDetails() {
        this.testService.getTestResultDetails(this.resultId).subscribe(res => {
            this.resultData = res;
        });
    }

    getOptionText(question: any, optionKey: string): string {
        if (question.questionType === 'MULTIPLE_CHOICE') {
            return question[optionKey] || optionKey;
        }
        return optionKey;
    }
}
