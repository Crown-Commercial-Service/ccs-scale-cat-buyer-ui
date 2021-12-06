/* tslint:disable */
/* eslint-disable */
/**
 * SCALE Commercial Agreements Service
 * This API allows access to CCS Commercial Agreement data. This is used both to provide information to users and to govern the behaviour of other systems for example 'Buy a Thing' and 'Contract for a Thing', where processes may differ based on the configuration of the underlying Commercial Agreement and Lot.
 *
 * OpenAPI spec version: v0.0.9
 * Contact: apiteam@crowncommercial.gov.uk
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
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
