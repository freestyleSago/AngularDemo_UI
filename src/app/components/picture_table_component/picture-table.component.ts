import { Component, OnInit, ViewChild } from "@angular/core";
import { Picture } from "../../models/Picture";
import { MatTableDataSource, MatDialog, MatPaginator, fadeInContent, MatPaginatorIntl } from "@angular/material";
import { PictureService } from "../../services/PicturesService";
import { AppConfig } from "../../Appconfig";
import { Picture_Edit_Component } from "../picture_edit_component/picture_edit_component";
import { PageEvent } from '@angular/material';

@Component({
    selector: "picture-table",
    templateUrl: "./picture-table.component.html",
    styleUrls: ["./picture-table.component.css"]
})

export class Picture_tableComponent implements OnInit {
    constructor(private pictureService: PictureService, private appConfig: AppConfig, private pictureEditDialog: MatDialog) {
    }

    ngOnInit(): void {

    }

    async  ngAfterViewInit() {
        this.MatPaginator._intl.itemsPerPageLabel = "每页";
        // this.MatPaginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        //     if (length == 0 || pageSize == 0) {
        //         return `0 of ${length}`;
        //     } 
        //     length = Math.max(length, 0); 
        //     const startIndex = page * pageSize; 
        //     // If the start index exceeds the list length, do not try and fix the end index to the end. 
        //     const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; 
        //     return `${startIndex + 1} - ${endIndex} of ${length}`;
        // };
        this.MatPaginator._intl.nextPageLabel = "下一页";
        this.MatPaginator._intl.previousPageLabel = "上一页";
        // this.PicturesData.paginator = this.MatPaginator;
        await this.LoadData();
        // this.dataSource.sort = this.sort;
    }

    @ViewChild(MatPaginator) MatPaginator: MatPaginator;
    DisplayedColumns = ["image", "name", "description", "actions"];
    PicturesData: MatTableDataSource<Picture> = new MatTableDataSource<Picture>();
    Length: number;
    PageSize: number;
    PageSizeOptions: number[] = [5, 10, 15, 20];
    IsLoadingResults: boolean = false;
    IsRateLimitReached: boolean = false;

    async LoadData(flag: boolean = true) {
        this.IsLoadingResults = true;
        const source = await this.pictureService.GetPicturesAsync(null, this.MatPaginator.pageIndex, this.MatPaginator.pageSize);
        source.Data.forEach((value, index, array) => {
            value.src = `${this.appConfig.ApiBaseAddress}/api/image/${value._id}`;
        });
        this.PicturesData.data = source.Data;
        this.Length = source.Count;
        this.IsLoadingResults = false;
    }

    async GetPicturesAsync(pageEvent): Promise<void> {
        this.LoadData(true);
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