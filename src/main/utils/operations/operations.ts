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

}