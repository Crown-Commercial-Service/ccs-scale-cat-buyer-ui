//@ts-nocheck
import {FileMimeType} from './mimetype'

export class FileValidations{

        static sizeValidation = (fileSize: number) => {
        const KbsInGbs = 300000000;
        if(fileSize < KbsInGbs) return true;
        else return false;
        }

        static formatValidation = (mimeType ) => {
                console.log('**********************mimetype');
                console.log(mimeType);
                const allMimeTypes = Object.values(FileMimeType);
                const mergeMimeTypes = allMimeTypes.flat(1);
                const checkForFileMimeType = mergeMimeTypes.filter(aMimeType => aMimeType === mimeType).length > 0;
                return checkForFileMimeType;
        }
}