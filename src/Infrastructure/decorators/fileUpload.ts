import { Middleware } from '@overnightjs/core';
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const imageFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Please upload only images.', false);
    }
};

const storage = multer.diskStorage({
    destination: path.join(process.cwd(), 'tmp', 'files')
});

const upload = multer({ storage, fileFilter: imageFilter });

export function FileUpload() {
    return Middleware(upload.single('file'));
}
