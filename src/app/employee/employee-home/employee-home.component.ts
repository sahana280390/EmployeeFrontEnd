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
  pageSize:any;
 
  

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.retrieveManagerList();
    //this.retrieveDepartmentList();
  }

  retrieveManagerList() {
    this.employeeService.fetchManagerList().subscribe(data => {
      this.managerList = data;
      this.retrieveDepartmentList()
     
  })
}
  retrieveDepartmentList(){
    this.employeeService.fetchDepartmentList().subscribe(data => {
      this.departmentList = data;
      this.retrieveEmployeeList();
    })
  }

  retrieveEmployeeList() {
    this.fetchEmployees({ page: "0", size: "10" });
  }

  private fetchEmployees(request) {
    this.loading = true;
    this.employeeService.fetchEmployeeList(request)
      .subscribe(data => {
        this.employeeList = data['content'];
        this.employeeList = this.employeeList.sort((one, two) => (one.employeeId > two.employeeId ? -1 : 1));
        this.totalElements = data['totalElements'];
        this.loading = false;
        this.pageSize=10;
      }, error => {
        this.loading = false;
      });
  }

  private deleteEmployee(employeeId) {
    this.employeeService.deleteEmployee(employeeId).subscribe(response => {
      //console.log(response);
      this.fetchEmployees({ page: "0", size: "10" });
    })
  }

  public addEmployee(){

    window.scroll(0, 0);
    const dialogRef = this.dialog.open(AddEditEmployeeComponent, {
      panelClass: 'AddEditEmployee__popup',
      disableClose: true,
      data: {header:'Add Employee', content: new Employee()}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'OK') {
        this.fetchEmployees({ page: "0", size: "10" });
      }     

    });
   
  }


  public editEmployee(editEmployeeDataItem){
    window.scroll(0, 0);
   // console.log(editEmployeeDataItem);
    const dialogRef = this.dialog.open(AddEditEmployeeComponent, {
      panelClass: 'AddEditEmployee__popup',
      disableClose: true,
      data: {header:'Edit Employee', content: editEmployeeDataItem}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'OK') {
        this.fetchEmployees({ page: "0", size: "10" });
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
