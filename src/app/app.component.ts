import { Component, ViewChild } from '@angular/core';
import { PictureService } from './services/PicturesService';
import { Picture_tableComponent } from "./components/picture_table_component/picture-table.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private pictureService : PictureService){}
  title = 'app';

  @ViewChild("uploader") Uploader: any;
  @ViewChild(Picture_tableComponent) Picture_tableComponent: Picture_tableComponent;

  Upload_Click():void{
    this.Uploader.nativeElement.click();
  }

  Upload_Changed(files:FileList):void{
    if(files.length ==0)return;

    this.pictureService.UploadImage(files[0], this.Picture_tableComponent);
  }
}