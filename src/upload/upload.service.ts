import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    uploadFile(file) {
        const results = [];
        file.buffer
            .toString('utf-8')
            .split('\n')
            .forEach((row) => {
                if (row.trim() !== '') {
                    results.push(row.split(','));
                }
            });
        console.log(results);
    };
}
