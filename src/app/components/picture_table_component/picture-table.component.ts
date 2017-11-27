import { Component, OnInit, ViewChild } from "@angular/core";
import { Picture } from "../../models/Picture";
import { MatTableDataSource, MatDialog, MatPaginator } from "@angular/material";
import { PictureService } from "../../services/PicturesService";
import { AppConfig } from "../../Appconfig";
import { Picture_Edit_Component } from "../picture_edit_component/picture_edit_component";

@Component({
    selector: "picture-table",
    templateUrl: "./picture-table.component.html",
    styleUrls: ["./picture-table.component.css"]
})

export class Picture_tableComponent implements OnInit {
    constructor(private pictureService: PictureService, private appConfig: AppConfig, private pictureEditDialog: MatDialog) {
    }

    ngOnInit(): void {
        this.LoadData();
    }

    ngAfterViewInit() {
        this.PicturesData.paginator = this.MatPaginator;
        // this.dataSource.sort = this.sort;
    }

    @ViewChild(MatPaginator) MatPaginator: MatPaginator;
    DisplayedColumns = ["image", "name", "description", "actions"];

    PicturesData: MatTableDataSource<Picture>;

    async LoadData() {
        let source = await this.pictureService.GetPicturesAsync();
        source.forEach((value, index, array) => {
            value.src = `${this.appConfig.ApiBaseAddress}/api/image/${value._id}`;
        });
        this.PicturesData = new MatTableDataSource<Picture>(source);
    }

    ApplyFilter(filterValue: string): void {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.PicturesData.filter = filterValue;

    }

    DownloadImageButton_Click(item: Picture): void {
        this.pictureService.DownloadImage(item._id, item.name);
    }

    ModifyPictureButton_Click(item: Picture): void {
        let dialogRef = this.pictureEditDialog.open(Picture_Edit_Component, {
            minWidth: "250px",
            data: item
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.LoadData();
            }
        });
    }

    async DeletePictureButton_Click(id: string) {
        if (await this.pictureService.DeletePictureAsync(id)) {
            this.LoadData();
        }
    }

    async SavePictureButton_Click(item: Picture) {
        await this.pictureService.UpdatePictureAsync(item);
    }
}