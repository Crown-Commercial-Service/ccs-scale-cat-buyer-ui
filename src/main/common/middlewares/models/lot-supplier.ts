/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface LotSupplier
 */
export interface LotSupplier {
    /**
     * 
     * @type {Organization}
     * @memberof LotSupplier
     */
    organization?: any;
    /**
     * 
     * @type {string}
     * @memberof LotSupplier
     */
    supplierStatus?: LotSupplierSupplierStatusEnum;
    /**
     * 
     * @type {Array&lt;Contact&gt;}
     * @memberof LotSupplier
     */
    lotContacts?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum LotSupplierSupplierStatusEnum {
    Active = 'active',
    Suspended = 'suspended',
    Excluded = 'excluded'
}

