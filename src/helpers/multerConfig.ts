import { diskStorage } from 'multer';

export const multerConfig = {
    dest: './uploads', // Define your destination folder for uploaded files
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, './uploads'); // The destination folder where files will be stored
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    }),
};
