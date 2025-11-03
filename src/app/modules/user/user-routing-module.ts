import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { TakeTest } from './components/take-test/take-test';

const routes: Routes = [
  {path: 'dashboard', component: Dashboard},
  {path: 'take-test/:id', component: TakeTest},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
