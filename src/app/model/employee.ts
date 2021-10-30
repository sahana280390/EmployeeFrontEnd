import { Department } from './department';

export class EmployeeListResponse {
    content: Employee[];
    totalElements: number;
}
export class Employee{
    employeeId: number;
    firstName: string;
    lastName: string;
    emailId: string;
    phoneNumber: string;
    salary:string;
    department: Department;
    hireDate: Date;
    manager:number;
}