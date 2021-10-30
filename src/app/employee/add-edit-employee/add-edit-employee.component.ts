import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee.service';
import { Manager } from 'src/app/model/manager';
import { Department } from 'src/app/model/department';
import { Employee } from 'src/app/model/employee';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {

  public employeeForm: FormGroup = new FormGroup({
    employeeId: new FormControl(''),
    firstName: new FormControl('',Validators.required),
    lastName: new FormControl('', Validators.required),
    emailId: new FormControl('',[Validators.required,Validators.email]),
    salary: new FormControl('',Validators.required),
    phoneNumber: new FormControl('',[Validators.pattern('^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$')]),
    department: new FormControl({},Validators.required),
    hireDate: new FormControl(new Date()),
    manager: new FormControl('',Validators.required)
  });

  managerList: Manager[]=[];
  departmentList: Department[]=[];
  employeeObj:Employee;
  departmentSelected: string;

  constructor( public dialogRef: MatDialogRef<AddEditEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private employeeService: EmployeeService,
    private dialog: MatDialog,private notificationBar: MatSnackBar) {}

  ngOnInit(): void {
    this.retrieveManagerList();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.departmentName === o2.departmentName && o1.departmentId === o2.departmentId;
  }

  retrieveManagerList() {
    this.employeeService.fetchManagerList().subscribe(data => {
      this.managerList = data;
      this.retrieveDepartmentList();
  })
}

  public retrieveDepartmentList(){
    this.employeeService.fetchDepartmentList().subscribe(data => {
      this.departmentList = data;
     if(this.data.header === 'Edit Employee'){
      this.employeeForm.reset(this.data.content);
     }
    
     console.log(this.employeeForm.value);
    })
  }

  onOKClick(): void {
    console.log('hie',this.employeeForm.value);
    this.employeeObj = this.employeeForm.value;
    this.dialogRef.close({'action': 'OK'});
    this.employeeService.saveEmployee(this.employeeObj).subscribe(response => {
      console.log(response);
    },err=> {
     // console.log('error in the form',err.error.errors);
      if(err.error && err.error.errors && err.error.errors != null){
         const dialogRef = this.dialog.open(ErrorComponent, {
        width: '430px',
        data: {header:'Error while saving the Employee Data', content:err.error.errors }
      });
      } else {
          this.notificationBar.open('Employee Data is not saved', 'Close');
        }
      });
   
  }

  onCancelClick():void{
    this.dialogRef.close({'action': 'Cancel'});
  }
}
