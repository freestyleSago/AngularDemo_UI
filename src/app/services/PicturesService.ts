import { Injectable } from "@angular/core";
import { Picture } from "../models/Picture";
import { HttpClient, HttpEventType, HttpRequest, HttpResponse, HttpParams } from "@angular/common/http";
import { AppConfig } from "../Appconfig";
import 'rxjs/add/operator/retry'
import { HttpErrorResponse } from "@angular/common/http/src/response";
import { Picture_tableComponent } from "../components/picture_table_component/picture-table.component";
import { ResponseData } from "../models/ResponseData";

@Injectable()
export class PictureService {

    constructor(private http: HttpClient, private appconfig: AppConfig) {
    }

    async GetPicturesAsync(condition: any, pageIndex: number, pageSize: number): Promise<ResponseData<Picture[]>> {
        let httpClient = this.http, appconfig = this.appconfig;
        //Angular里Get方法不允许Post参数。只能通过地址栏传参
        let url = `${appconfig.ApiBaseAddress}/api?skip=${pageIndex * pageSize}&limit=${pageSize}`;

        return new Promise<ResponseData<Picture[]>>((resolve, reject) => {
            httpClient.get<ResponseData<Picture[]>>(url).retry(3).subscribe(
                data => {
                    resolve(data);
                },
                (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log(err.error.message);
                        reject(err.error.message);
                    } else {
                        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                        reject(`Backend returned code ${err.status}, body was: ${err.error}`);
                    }
                });
        });
    }

    async UpdatePictureAsync(picture: Picture): Promise<boolean> {
        let httpClient = this.http, appconfig = this.appconfig;
        return new Promise<boolean>((resolve, reject) => {
            httpClient.put(`${appconfig.ApiBaseAddress}/api/put`, picture).subscribe(
                data => {
                    resolve(true);
                },
                err => {
                    console.log(err);
                    reject(false);
                }
            );
        });
    }

    async DeletePictureAsync(id: string): Promise<boolean> {
        let httpClient = this.http, appconfig = this.appconfig;
        return new Promise<boolean>((resolve, reject) => {
            httpClient.delete(`${appconfig.ApiBaseAddress}/api/del/${id}`).subscribe(
                data => {
                    resolve(<boolean>data);
                },
                (err: Error) => {
                    console.log(err.message);
                    reject(false);
                }
            );
        });
    }

    async UploadImageAsync(file: File): Promise<boolean> {
        let httpClient = this.http;
        return new Promise<boolean>((resolve, reject) => {
            let postData = new FormData();
            postData.append("fileName", file.name);
            postData.append("file", file);
            httpClient.request(new HttpRequest("POST", `${this.appconfig.ApiBaseAddress}/api/upload`, postData, {
                reportProgress: true
            })).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    // This is an upload progress event. Compute and show the % done:
                    let percentDone = Math.round(100 * event.loaded / event.total);
                    console.log(`${file.name} is ${percentDone}% uploaded.`);
                } else if (event instanceof HttpResponse) {
                    resolve(true);
                    console.log(`${file.name} is completely uploaded!`);
                }
            }, (err: Error) => {
                console.log(err.message);
                reject(false);
            });
        });
    }

    DownloadImage(id: string, fileName: string): void {
        window.open(`${this.appconfig.ApiBaseAddress}/api/image/${id}?filename=${fileName}`);
    }
}