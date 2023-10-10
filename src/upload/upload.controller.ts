import {
    BadRequestException,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadService} from "./upload.service";

@Controller('upload')
export class UploadController {
    constructor(private uploadService: UploadService) {}

    @Post()
    @UseInterceptors(FileInterceptor('csvFile'
     // , { dest: './uploads' }
    ))
    async uploadFile(@UploadedFile(new ParseFilePipe(
        {
            validators: [
                new FileTypeValidator({ fileType: 'csv' }),
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
            ],
        }
    ),) file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        return this.uploadService.uploadFile(file);
    }
}
