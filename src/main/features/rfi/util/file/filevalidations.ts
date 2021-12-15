//@ts-nocheck
import {FileMimeType} from './mimetype'

export class FileValidations{

        static sizeValidation = (fileSize: number) => {
        const KbsInGbs = 1000000000;
        if(fileSize < KbsInGbs) return true;
        else return false;
        }

        static formatValidation = (mimeType ) => {
                const allMimeTypes = Object.values(FileMimeType);
                const checkForFileMimeType = allMimeTypes.filter(aMimeType => aMimeType === mimeType).length > 0;
               return checkForFileMimeType;
        }
}