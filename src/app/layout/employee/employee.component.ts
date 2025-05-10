import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IEmployee } from 'src/app/interface/employee.interface';
import { EmployeeService } from 'src/app/Service/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  employeeList:IEmployee[]=[];
 isEditMode:boolean=false;
  isviewForm:boolean=false;
  selectedEmployeeID:string|null=null;
constructor( private employeeService:EmployeeService)
{

}
ngOnInit()
{
  this.getEmplyees();
}
photoUrl(photo: string): string {
  return photo ? 'data:image/jpeg;base64,' + photo : '';
}
getEmplyees(){
  this.employeeService.getEmployees().subscribe(data=>{
    this.employeeList=data;
  } );
}
viewFormAdd(){
  this.isviewForm=true;
  this.selectedEmployeeID="";
  this.isEditMode=false;
}

viewFormEdit(ID:string){
   this.isviewForm=true;
  this.selectedEmployeeID=ID;
  this.isEditMode=true;
}
handleSave(){
  this.isviewForm=false;
  this.getEmplyees()
}
deleteEmployee(ID:string){
this.employeeService.deleteEmployee(ID).subscribe(()=>{
  this.getEmplyees()
})
}
}