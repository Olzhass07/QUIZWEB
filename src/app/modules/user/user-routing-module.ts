import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { TakeTest } from './components/take-test/take-test';
import { ViewMyTestResults } from './components/view-my-test-results/view-my-test-results';

const routes: Routes = [
  {path: 'dashboard', component: Dashboard},
  {path: 'view-test-results', component: ViewMyTestResults},
  {path: 'take-test/:id', component: TakeTest},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
