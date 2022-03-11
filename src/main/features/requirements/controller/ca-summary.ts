//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/ca-summary.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_SUMMARY = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const {
      lotId,
      agreementLotName,
      agreementName,
      projectId,
      agreement_id,
      releatedContent,
      project_name,
      isError,
      errorText,
      currentEvent,
      choosenViewPath
    } = req.session;

    const agreementId_session = agreement_id;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    res.locals.agreement_header = {
      agreementName,
      project_name,
      agreementId_session,
      agreementLotName,
      lotId,
      error: isJaggaerError,
    };
  
    const { assessmentId } = currentEvent;


    try {
        const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
        const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
        const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
        const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];
    
        const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
        const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
        let CAPACITY_DATASET = CAPACITY_DATA.data;

        let {dimensionRequirements} = ALL_ASSESSTMENTS_DATA;
        const DRequirements = dimensionRequirements?.[0]?.requirements;

        /**
         * @SERVER_CAPAbility
         */
        const ServiceCapabilityStorage = CAPACITY_DATASET.filter(item => item.name == 'Service Capability')[0].options;
        var ServiceStorageWithVal = [];

        /**
         * @Location_Storage
         */

        const LocationStorage = CAPACITY_DATASET.filter(item => item.name == 'Location')[0].options;
        var LocationStorageWithVal = [];

        /**
         * @Security_Clearance
         */
       
        const SecruityStorage = CAPACITY_DATASET.filter(item => item.name == 'Security Clearance')[0].options;
        var SecurityStorageWithVal = [];

        if( dimensionRequirements?.[0]?.requirements != undefined){
            /**
             * @Service_capbility
             */
            ServiceStorageWithVal = ServiceCapabilityStorage.map(items => {
                const FindElement = DRequirements.filter(subItems => subItems['requirement-id'] == items['requirement-id']);
                if(FindElement.length != 0) return {...items, ...FindElement[0]}
                else return null
            }).filter(subItems => subItems != null)
            
            var UNIQUE_TITLES = new Set();
            for(const item of ServiceStorageWithVal){
                UNIQUE_TITLES.add(item.name)
            }
            /***This is the putting unique items */
            ServiceStorageWithVal = [...UNIQUE_TITLES].map(item => {
               const FoundIndex = ServiceStorageWithVal.filter(i => i.name == item)[0];
               return {
                   ...FoundIndex
               }
            }).map(nestItems => {
                var {groups} = nestItems;
                groups = groups[0];
                const reformRroups = {groupname: groups.name, level: groups.level} 
                return {
                    ...nestItems,
                    ...reformRroups
                }
            })

            var UNIQUE_GROUPNAME = [...new Set(ServiceStorageWithVal.map(item => item.groupname))]; 
            UNIQUE_GROUPNAME = UNIQUE_GROUPNAME.map(item => {
                const findIteminServiceStorage = ServiceStorageWithVal.filter(subItem => subItem.groupname == item);
                return {
                    groupName: item,
                    data: findIteminServiceStorage
                }
            })
            ServiceStorageWithVal = UNIQUE_GROUPNAME;


             /**
             * @Location
             */
              LocationStorageWithVal = LocationStorage.map(items => {
                const FindElement = DRequirements.filter(subItems => subItems['requirement-id'] == items['requirement-id']);
                if(FindElement.length != 0) return {...items, ...FindElement[0]}
                else return null
            }).filter(subItems => subItems != null)
            
            var UNIQUE_TITLES_Location = new Set();
            for(const item of LocationStorageWithVal){
                UNIQUE_TITLES_Location.add(item.name)
            }
            /***This is the putting unique items */
            LocationStorageWithVal = [...UNIQUE_TITLES_Location].map(item => {
               const FoundIndex = LocationStorageWithVal.filter(i => i.name == item)[0];
               return {
                   ...FoundIndex
               }
            }).map(nestItems => {
                var {groups} = nestItems;
                groups = groups[0];
                const reformRroups = {groupname: groups.name, level: groups.level} 
                return {
                    ...nestItems,
                    ...reformRroups
                }
            })

            var UNIQUE_GROUPNAME_Location = [...new Set(LocationStorageWithVal.map(item => item.groupname))]; 
            UNIQUE_GROUPNAME_Location = UNIQUE_GROUPNAME_Location.map(item => {
                const findIteminServiceStorage = ServiceStorageWithVal.filter(subItem => subItem.groupname == item);
                return {
                    groupName: item,
                    data: findIteminServiceStorage
                }
            })
            LocationStorageWithVal = UNIQUE_GROUPNAME_Location;


             /**
             * @Security_Clearance
             */
              SecurityStorageWithVal = SecruityStorage.map(items => {
                const FindElement = DRequirements.filter(subItems => subItems['requirement-id'] == items['requirement-id']);
                if(FindElement.length != 0) return {...items, ...FindElement[0]}
                else return null
            }).filter(subItems => subItems != null)
            
            var UNIQUE_TITLES_Security = new Set();
            for(const item of LocationStorageWithVal){
                UNIQUE_TITLES_Security.add(item.name)
            }
            /***This is the putting unique items */
            SecurityStorageWithVal = [...UNIQUE_TITLES_Security].map(item => {
               const FoundIndex = SecurityStorageWithVal.filter(i => i.name == item)[0];
               return {
                   ...FoundIndex
               }
            }).map(nestItems => {
                var {groups} = nestItems;
                groups = groups[0];
                const reformRroups = {groupname: groups.name, level: groups.level} 
                return {
                    ...nestItems,
                    ...reformRroups
                }
            })

            var UNIQUE_GROUPNAME_Security = [...new Set(SecurityStorageWithVal.map(item => item.groupname))]; 
            UNIQUE_GROUPNAME_Security = UNIQUE_GROUPNAME_Security.map(item => {
                const findIteminServiceStorage = ServiceStorageWithVal.filter(subItem => subItem.groupname == item);
                return {
                    groupName: item,
                    data: findIteminServiceStorage
                }
            })
            SecurityStorageWithVal = UNIQUE_GROUPNAME_Security;

        }
        

        const windowAppendData = {
            data: CMSData,
            releatedContent,
            choosenViewPath,
            ServiceStorageWithVal,
            LocationStorageWithVal,
            SecurityStorageWithVal
        }
     //  res.json(CAPACITY_DATASET)
    res.render('ca-summary.njk', windowAppendData);
        
    } catch (error) {
        
    }


 
}



/**
 *
 * @param req
 * @param res
 * @POSTController
 */
 export const CA_POST_SUMMARY = async (req: express.Request, res: express.Response) => {
    res.json({'msg': 'working'})
}