import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IEmployee } from 'src/app/interface/employee.interface';
import { EmployeeService } from 'src/app/Service/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
})
export class EmployeeFormComponent implements OnChanges {
  employeeForm: FormGroup;
  @Input() employeeId: string | null = '';
  @Input() isEditMode: boolean = false;
  @Output() onSave = new EventEmitter<void>();
  selectedFile: any;
  constructor(
    private employeeService: EmployeeService,
    private toastr: ToastrService
  ) {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('[A-Za-z]'),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobileNumber: new FormControl('', [Validators.required]),
      homeAddress: new FormControl('', [Validators.required]),
      photoFile: new FormControl(''),
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeId']) {
      if (this.employeeId != '' && this.employeeId != null) {
        this.employeeService
          .getEmployeeByID(this.employeeId)
          .subscribe((data) => {
            debugger;
            this.fillForm(data);
          });
      }
    }
  }
  ngOnInit() {
    if (this.employeeId != '' && this.employeeId != null) {
      this.employeeService
        .getEmployeeByID(this.employeeId)
        .subscribe((data) => {
          this.fillForm(data);
        });
    }
  }
  cancel() {
    this.onSave.emit();
  }
  photoUpload($event: any) {
    const file: File = $event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.employeeForm.patchValue({
        photoFile: file,
      });
    }
  }

  fillForm(data: IEmployee) {
    this.employeeForm.patchValue(data);//عشان تعبي الداتا داخل الفورم
  }
  save() {
    if (this.isEditMode && this.employeeId) {
      const updatedEmployee = this.employeeForm.value;

      const formData = new FormData();
      formData.append('id', this.employeeId);
      formData.append('name', this.employeeForm.get('name')?.value);
      formData.append('email', this.employeeForm.get('email')?.value);
      formData.append(
        'mobileNumber',
        this.employeeForm.get('mobileNumber')?.value
      );
      formData.append(
        'homeAddress',
        this.employeeForm.get('homeAddress')?.value
      );

      if (this.selectedFile) {
        formData.append('photoFile', this.selectedFile, this.selectedFile.name);
      }
      this.employeeService.updateEmployee(formData).subscribe(
        (data) => {
          if (data != null) {
            this.toastr.success('Updated successfully!');
            this.onSave.emit();
          }
        },
        (error) => console.log('Error', error)
      );
    } else {
      const formData = new FormData();
      formData.append('name', this.employeeForm.get('name')?.value);
      formData.append('email', this.employeeForm.get('email')?.value);
      formData.append(
        'mobileNumber',
        this.employeeForm.get('mobileNumber')?.value
      );
      formData.append(
        'homeAddress',
        this.employeeForm.get('homeAddress')?.value
      );

      if (this.selectedFile) {
        formData.append('photoFile', this.selectedFile, this.selectedFile.name);
      }

      this.employeeService.insertEmployee(formData).subscribe(
        (data) => {
          if (data != null) {
            this.toastr.success('Add successfully!');
            this.employeeForm.reset();
            this.onSave.emit();
          }
        },
        (error) => console.log('Error', error)
      );
    }
  }
}
