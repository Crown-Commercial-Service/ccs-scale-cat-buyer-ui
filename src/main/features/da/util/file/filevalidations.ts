//@ts-nocheck
import {FileMimeType} from './mimetype'

export class FileValidations{

        static sizeValidation = (fileSize: number) => {


        const KbsInGbs = 300000000;
        if(fileSize < KbsInGbs) return true;
        else return false;
        }

        static formatValidation = (mimeType ) => {
                return Object.keys(FileMimeType).some(key => FileMimeType[key].some(item =>item === mimeType));
        }
}