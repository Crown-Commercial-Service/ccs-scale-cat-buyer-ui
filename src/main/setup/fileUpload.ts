//@ts-nocheck
import * as express from 'express';
import fileUpload from 'express-fileupload'


const fileUploadSetup = (app: express.Express): void => {

    app.use(fileUpload());
      
  
};

export { fileUploadSetup };