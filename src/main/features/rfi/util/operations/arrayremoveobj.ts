export const RemoveDuplicatedList  = (array: Array<any>, ToRemove: Array<any>)=> {
    for( var i=array.length - 1; i>=0; i--){
        for( var j=0; j<ToRemove.length; j++){
            if(array[i] && (array[i].userName === ToRemove[j].userName)){
                array.splice(i, 1);
            }
        }
    }
    return array;

}