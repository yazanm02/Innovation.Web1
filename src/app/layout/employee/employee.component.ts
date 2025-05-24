import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IEmployee } from 'src/app/interface/employee.interface';
import { EmployeeService } from 'src/app/Service/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  selectedColumns: string[] = [];
allColumns: string[] = ['Name', 'Email', 'MobileNumber', 'HomeAddress'];
showExportModal: boolean = false;
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

openExportModal() {
  this.selectedColumns = [];
  this.showExportModal = true;
}

closeExportModal() {
  this.showExportModal = false;
}

onColumnToggle(event: any) {
  const column = event.target.value;
  if (event.target.checked) {
    this.selectedColumns.push(column);
  } else {
    this.selectedColumns = this.selectedColumns.filter(c => c !== column);
  }
}

exportToExcel() {
  if (!this.selectedColumns || this.selectedColumns.length === 0) {
    alert("Please select at least one column.");
    return;
  }

  const uniqueColumns = [...new Set(this.selectedColumns)];

  this.employeeService.exportToExcel('Employees', 'Employee Report', uniqueColumns)
    .subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Employees.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
        this.closeExportModal();
      },
      error: (error) => {
        console.error("Error downloading Excel file:", error);
        alert("Failed to export Excel file. Please check the selected columns or try again.");
      }
    });
}






}