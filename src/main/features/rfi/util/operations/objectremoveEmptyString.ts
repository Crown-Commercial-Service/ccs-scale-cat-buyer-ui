/**
 * @Helper 
 * @description
 * Allows Modifying Object
 */

export class ObjectModifiers {

    /**
     * 
     * @param Request_params 
     * @returns 
     * @type Recursive function
     */
    static _removeEmptyStringfromObjectValues = (Request_params : any)=> {
        return Object.keys(Request_params)
        .filter(function (a_key_pointer) {
          return Request_params[a_key_pointer] !== "";
        })
        .reduce(function (reconstructive_object : any, a_key_pointer) {
          reconstructive_object[a_key_pointer] = Request_params[a_key_pointer];
          return reconstructive_object;
        }, {});
    } 
}