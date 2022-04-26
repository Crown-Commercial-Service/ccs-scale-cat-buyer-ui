
export class htmlToText{
    
    static convertor = (strInputCode : String) => {
        return strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
    }

}
