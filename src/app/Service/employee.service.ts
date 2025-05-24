import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmployee } from '../interface/employee.interface';

import { saveAs } from 'file-saver';
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
  
exportToExcel(sheetName: string, title: string, selectedColumns: string[]): Observable<Blob> {
  let params = new HttpParams()
    .set('sheetName', sheetName)
    .set('title', title);

  selectedColumns.forEach(col => {
    params = params.append('selectedColumns', col);
  });

  return this.http.get('https://localhost:7120/api/Employee/ExportSelected', {
    params: params,
    responseType: 'blob'
  });
}


}
