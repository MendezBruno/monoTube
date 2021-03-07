import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';

export const videoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(3gp|mp4|avi)$/)) {
    return callback(
      new HttpException(
        'Only video files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const destination = (req, file, cb) => {
  cb(null, './uploads');
};

export const localOptionMulter = {
  storage: diskStorage({
    destination: destination,
    filename: editFileName,
  }),
  fileFilter: videoFileFilter,
}
