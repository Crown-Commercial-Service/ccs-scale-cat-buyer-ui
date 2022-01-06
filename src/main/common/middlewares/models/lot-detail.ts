/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface LotDetail
 */
export interface LotDetail {
    /**
     * 
     * @type {LotId}
     * @memberof LotDetail
     */
    number?: any;
    /**
     * Lot name
     * @type {string}
     * @memberof LotDetail
     */
    name?: any;
    /**
     * Effective start date of Lot
     * @type {string}
     * @memberof LotDetail
     */
    startDate?: any;
    /**
     * Effective end date of Lot
     * @type {string}
     * @memberof LotDetail
     */
    endDate?: any;
    /**
     * Short textual description of the Lot
     * @type {string}
     * @memberof LotDetail
     */
    description?: any;
    /**
     * Supplier count
     * @type {string}
     * @memberof LotDetail
     */
    suppliers?: any;
    /**
     * 
     * @type {string}
     * @memberof LotDetail
     */
    type?: LotDetailTypeEnum;
    /**
     * Routes to Market for the Lot and associated bounds
     * @type {Array&lt;RouteToMarket&gt;}
     * @memberof LotDetail
     */
    routesToMarket?: any;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof LotDetail
     */
    sectors?: any;
    /**
     * 
     * @type {Array&lt;RelatedAgreementLot&gt;}
     * @memberof LotDetail
     */
    relatedAgreementLots?: any;
    /**
     * 
     * @type {Array&lt;LotRule&gt;}
     * @memberof LotDetail
     */
    rules?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum LotDetailTypeEnum {
    Product = 'product',
    Service = 'service',
    ProductAndService = 'product and service'
}

