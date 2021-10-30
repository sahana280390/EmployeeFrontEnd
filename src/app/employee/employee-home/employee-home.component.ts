import { Component, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditEmployeeComponent } from '../add-edit-employee/add-edit-employee.component';
import { Department } from 'src/app/model/department';
import { Manager } from 'src/app/model/manager';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.scss']
})
export class EmployeeHomeComponent implements OnInit {

  totalElements: number = 0;
  employeeList: Employee[] = [];
  managerList: Manager[]=[];
  departmentList: Department[]=[];
  loading: boolean;
  addEmployeeDataItem: Employee;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.retrieveManagerList();
    this.retrieveDepartmentList();
  }

  retrieveManagerList() {
    this.employeeService.fetchManagerList().subscribe(data => {
      this.managerList = data;
      //console.log('managerLIst',this.managerList);
  })
}
  retrieveDepartmentList(){
    this.employeeService.fetchDepartmentList().subscribe(data => {
      this.departmentList = data;
     // console.log('department',this.departmentList);
    })
  }

  retrieveEmployeeList() {
    this.fetchEmployees({ page: "0", size: "5" });
  }

  private fetchEmployees(request) {
    this.loading = true;
    this.employeeService.fetchEmployeeList(request)
      .subscribe(data => {
        this.employeeList = data['content'];
        this.totalElements = data['totalElements'];
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  private deleteEmployee(employeeId) {
    this.employeeService.deleteEmployee(employeeId).subscribe(response => {
      //console.log(response);
      this.fetchEmployees({ page: "0", size: "5" });
    })
  }

  public addEmployee(){
     /** Dialog modal called on the file exceeding limit error and on notification date being empty */
  // this.addEmployeeDataItem = new Employee();
    const dialogRef = this.dialog.open(AddEditEmployeeComponent, {
      width: '450px',
      data: {header:'Add Employee', content: new Employee()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'OK') {
        this.fetchEmployees({ page: "0", size: "5" });
      }     

    });
   
  }

  public editEmployee(editEmployeeDataItem){
   // console.log(editEmployeeDataItem);
    const dialogRef = this.dialog.open(AddEditEmployeeComponent, {
      width: '430px',
      data: {header:'Edit Employee', content: editEmployeeDataItem}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'OK') {
        this.fetchEmployees({ page: "0", size: "5" });
      }  

    });
   
  }

  nextPage(event: PageEvent) {
    const request = {};
    request['page'] = event.pageIndex.toString();
    request['size'] = event.pageSize.toString();
    this.fetchEmployees(request);
  }

}
