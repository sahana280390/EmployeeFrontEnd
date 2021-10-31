import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Manager } from '../model/manager';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  fetchEmployeeList(request) {
    const params = request;
    return this.http.get(environment.apiUrl + '/employees', { params });
  }

  deleteEmployee(id) {
    const endpoint = environment.apiUrl + `/employees/${id}`;
    return this.http.delete(endpoint);
  }

  saveEmployee(employee) {
    return this.http.post(environment.apiUrl + '/employees',employee);
  }

  fetchManagerList(): Observable<any> {
    return this.http.get(environment.apiUrl + '/managers');
  }

  fetchDepartmentList(): Observable<any>{
    return this.http.get(environment.apiUrl + '/departments');
  }
}