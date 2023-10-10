import { IsNotEmpty } from 'class-validator';

export class UploadCsvDto {
    @IsNotEmpty()
    csvFile: Express.Multer.File;
}
