import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatTabsModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatPaginatorModule
} from "@angular/material";
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { Picture_tableComponent } from "./components/picture_table_component/picture-table.component";
import { HttpClientModule } from "@angular/common/http";
import { AppConfig } from "./Appconfig";
import { PictureService } from "./services/PicturesService";
import { Picture_Edit_Component } from "./components/picture_edit_component/picture_edit_component";

@NgModule({
  declarations: [
    AppComponent,
    Picture_tableComponent,
    Picture_Edit_Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  entryComponents:[
    Picture_Edit_Component
  ],
  providers: [PictureService,AppConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
