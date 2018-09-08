import { Component, OnInit } from '@angular/core';
import { ProjectService } from "app/services/project.service";
import { ProjectCreationFormService, FormLocation } from "app/services/project-creation-form.service";
import { LoginService } from "app/services/login.service";

@Component({
  selector: 'app-create-project-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
  imageFile: File;
  name: string;
  hasError: boolean = false;
  errorMessage: string = "";

  constructor(public projectService: ProjectService, public projectCreationFormService: ProjectCreationFormService, public loginService: LoginService) { }

  ngOnInit() {

  }

  onFileChange(event){
    let fileList: FileList = event.target.files;

    if(fileList.length > 0) {
        let file: File = fileList[0];

        this.projectService.uploadImageForProject(this.projectCreationFormService.getProjectId(), this.loginService.userId, file).subscribe(data=>{
          this.projectCreationFormService.setFormLocation(FormLocation.DONE);
        },
        error => {
          this.hasError = true;
          this.errorMessage = error.error;
        });
    }
  }

  onSubmit(){
    let _formData = new FormData();
  }

  skipUploadingImage(){
    this.projectCreationFormService.setFormLocation(FormLocation.DONE);
  }
}
