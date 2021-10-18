export class operations {

    static equals = (arg1: any, args2: any) => {
        if(arg1 === args2){
            return true;
        }
        return false;
    }

    static notEquals = (arg1: any, args2: any) => {
        if(arg1 !== args2){
            return true;
        }
        return false;
    }

    static isUndefined = (Object_as_argument: any, Object_key : string)=> {
        if(Object_as_argument[Object_key] === undefined){
                return true;
        }
        return false;
    }

}