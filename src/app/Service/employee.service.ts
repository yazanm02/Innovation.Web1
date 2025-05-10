import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployee } from '../interface/employee.interface';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url="https://localhost:7120/api/Employee";
  constructor(private http:HttpClient) { }
  getEmployees():Observable<IEmployee[]>{
    return this.http.get<IEmployee[]>(this.url);
  }
  getEmployeeByID(id: string): Observable<IEmployee> {
   
    return this.http.get<IEmployee>(`${this.url}/${id}`);
  }
  deleteEmployee(id:string):Observable <void>{
    const params={id:id}
  return  this.http.delete<void>(this.url,{ params });
  }
  insertEmployee(employee: FormData): Observable<IEmployee> {
    const url = `${this.url}/InsertEmployee`;
    return this.http.post<IEmployee>(url, employee);
  }
  
  updateEmployee(employee: FormData): Observable<IEmployee> {
    const url = `${this.url}/UpdateEmployee`;
    return this.http.put<IEmployee>(url, employee);
  }
  
    
}
