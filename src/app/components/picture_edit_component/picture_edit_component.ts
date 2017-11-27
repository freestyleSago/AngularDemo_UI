import { Component, Inject } from "@angular/core";
import { Input } from "@angular/core/src/metadata/directives";
import { Picture } from "../../models/Picture";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PictureService } from "../../services/PicturesService";

@Component(
    {
        selector: "picture_edit_component",
        templateUrl: "./picture_edit_component.html"
    }
)

export class Picture_Edit_Component {
    constructor(public dialog: MatDialogRef<Picture_Edit_Component>, @Inject(MAT_DIALOG_DATA) data: Picture, private pictureService: PictureService) {
        this.picture = JSON.parse(JSON.stringify(data));
    }
    picture: Picture;

    private async SaveChanges(): Promise<void> {
        await this.pictureService.UpdatePictureAsync(this.picture);
        this.dialog.close(true);
    }
}