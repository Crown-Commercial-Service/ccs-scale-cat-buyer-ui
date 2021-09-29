export class Query {

    static isEmpty = (queryvalue : any) => {
        if(queryvalue === ""){
            return true;
        }
        else{
            return false;
        }
    }


    static isUndefined = (requestObject: any) => {
        if(requestObject === undefined){
            return true;
        }
        else{
            return false;
        }
    }
}