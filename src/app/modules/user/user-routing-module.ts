import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { TakeTest } from './components/take-test/take-test';
import { ViewMyTestResults } from './components/view-my-test-results/view-my-test-results';
import { ResultDetail } from './components/result-detail/result-detail';
import { Profile } from './components/profile/profile';

const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'profile', component: Profile },
  { path: 'view-test-results', component: ViewMyTestResults },
  { path: 'result-detail/:id', component: ResultDetail },
  { path: 'take-test/:id', component: TakeTest },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
