export class Query {
    /**
     * 
     * @param argument 
     * @returns  true if the argument is undefined
     */
    static isEmpty = (argument : any) => {
        if(argument === ""){
            return true;
        }
        else{
            return false;
        }
    }
    
    
    /**
     * 
     * @param argument 
     * @returns  true if the argument is undefined
     */
    static isUndefined = (argument: any) => {
        if(argument === undefined){
            return true;
        }
        else{
            return false;
        }
    }


    /**
     * 
     * @param argument
     * @returns if the argument is null
     */
    static isnull = (argument: any) => {
        if(argument === null){
            return true;
        }
        else{
            return false;
        }
    }

}