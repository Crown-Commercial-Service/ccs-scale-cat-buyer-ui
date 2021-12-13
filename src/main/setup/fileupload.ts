//@ts-nocheck
import * as express from 'express';
import fileUpload from 'express-fileupload'


const fileUploadSetup = (app: express.Express): void => {

    app.use(fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
      }));
      
  
};

export { fileUploadSetup };
