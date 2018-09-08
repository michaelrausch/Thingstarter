import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService } from 'app/services/project.service';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-update-image-element',
  templateUrl: './update-image-element.component.html',
  styleUrls: ['./update-image-element.component.css']
})
export class UpdateImageElementComponent implements OnInit {
  @Input() projectId;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  file: File;
  name: String;

  constructor(public projectService: ProjectService, public loginService: LoginService) { }

  ngOnInit() {
  }

  onFileChange(event){
    let fileList: FileList = event.target.files;
    
    if(fileList.length > 0) {
        this.file = fileList[0];        
    }
  }

  updateImage(){
    if (!this.file){
      return alert("No File")
    }

    if (!this.projectId) return;

    this.projectService.uploadImageForProject(this.projectId, this.loginService.userId, this.file)
      .subscribe(success => {
        if (this.onSuccess) this.onSuccess.emit(this.projectId);
        window.location.reload(); //TODO: Find out why this has to be called, image should automatically change when the model is changed
      },
      error => {
        alert("e")
      })
  }

}
