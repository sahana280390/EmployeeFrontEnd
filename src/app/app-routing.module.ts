import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeHomeComponent } from './employee/employee-home/employee-home.component';


const routes: Routes = [
  { path: '',  redirectTo: 'employee-home', pathMatch: 'full' },
  {path : 'employee-home', component: EmployeeHomeComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
