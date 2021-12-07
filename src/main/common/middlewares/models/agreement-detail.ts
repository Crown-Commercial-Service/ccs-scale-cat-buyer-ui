/* tslint:disable */
/* eslint-disable */
/**
 * 
 * @export
 * @interface AgreementDetail
 */
export interface AgreementDetail {
    /**
     * 
     * @type {AgreementId}
     * @memberof AgreementDetail
     */
    number?: any;
    /**
     * Commercial Agreement Name
     * @type {string}
     * @memberof AgreementDetail
     */
    name?: any;
    /**
     * Short textual description of the commercial agreement
     * @type {string}
     * @memberof AgreementDetail
     */
    description?: any;
    /**
     * Effective start date of Commercial Agreement
     * @type {string}
     * @memberof AgreementDetail
     */
    startDate?: any;
    /**
     * Effective end date of Commercial Agreement
     * @type {string}
     * @memberof AgreementDetail
     */
    endDate?: any;
    /**
     * URL of the Agreement detail page on the CCS website
     * @type {string}
     * @memberof AgreementDetail
     */
    detailUrl?: any;
    /**
     * 
     * @type {Organization}
     * @memberof AgreementDetail
     */
    owner?: any;
    /**
     * 
     * @type {Array&lt;Contact&gt;}
     * @memberof AgreementDetail
     */
    contacts?: any;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof AgreementDetail
     */
    benefits?: any;
    /**
     * 
     * @type {Array&lt;LotSummary&gt;}
     * @memberof AgreementDetail
     */
    lots?: any;
    /**
     * 
     * @type {Array&lt;LotDetail&gt;}
     * @memberof AgreementDetail
     */
    lotDetails?: any;
}
