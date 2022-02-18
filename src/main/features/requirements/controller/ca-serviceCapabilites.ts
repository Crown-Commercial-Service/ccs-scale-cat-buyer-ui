//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caService from '../../../resources/content/requirements/caService.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
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
    currentEvent
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

    CAPACITY_DATASET = CAPACITY_DATASET.filter(levels =>  levels['name'] === 'Service Capability')

    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
      const {weightingRange, options} = item;
      return options.map(subItem => {
        return {
          ...subItem, weightingRange
        }
      })
    }).flat();

    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map(item => {
      const optionID = item['option-id'];
      const {name, groups, weightingRange} = item;
      const groupname = name;
      return groups.map(group => {
        return {
          ...group,
          groupname,
          weightingRange,
          optionID
        }
      })
    }).flat()
   
    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map(item => item.name))]; 

    const CATEGORIZED_ACCORDING_DESIGNATION = [];


    for(const category of UNIQUE_DESIGNATION_CATEGORY){

      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter(item => {
        return item.name == category
      });
      const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
      const MAPPEDACCORDINGTOCATEGORY = {
        category,
        data: FINDRELEVANTCATEGORY,
        Weightage: Weightage
      }
      CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY)
    }


    let Level1DesignationStorageForHeadings = [];

    for(const desgination of CATEGORIZED_ACCORDING_DESIGNATION){
      const {Weightage, data, category} = desgination;
      const filteredLevel1Content = data.filter(role => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category
      }
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings.filter(designation => designation.data.length !== 0);



    const TableHeadings = Level1DesignationStorageForHeadings.map((item, index) => {
      return {
          "url": `#section${index}`,
          "text": item.category,
          "subtext": `${item.Weightage.min}% / ${item.Weightage.max}%`
      }
    })

    /**
     * Removing duplicated designations
     */  
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map(item => {
      const {Weightage, data, category} = item;
      const UNIQUESET = [...new Set(data.map(item => item.groupname))]; 
      const JOBSTORAGE = [];
      for(const uniqueItem of UNIQUESET){
        const filteredContents = data.filter(designation => designation.groupname === uniqueItem)[0];
        JOBSTORAGE.push(filteredContents);
      }
      return {Weightage, data: JOBSTORAGE.flat(), category};
    })

      /**
     * Levels 1 designaitons
     */
    
      let Level1DesignationStorage = [];

      for(const desgination of REMOVED_DUPLICATED_JOB){
        const {Weightage, data, category} = desgination;
        const filteredLevel1Content = data.filter(role => role.level === 1);
        const ReformedObject = {
          Weightage,
          data: filteredLevel1Content,
          category
        }
        Level1DesignationStorage.push(ReformedObject);
      }

      Level1DesignationStorage = Level1DesignationStorage.filter(designation => designation.data.length !== 0);
    const windowAppendData = { ...caService, lotId, agreementLotName, releatedContent, isError, errorText, TABLE_HEADING:TableHeadings, TABLE_BODY: Level1DesignationStorage };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'In progress');

  //res.json(Level1DesignationStorage)
   res.render('ca-serviceCapabilities', windowAppendData);
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA learn page',
      true,
    );
  }
};












/**
 * 
 * @param req 
 * @param res 
 * 
 * @POST
 */
export const CA_POST_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  const {ca_service_started} = req.body;

  let {ca_partial_weightage, weight_vetting_partial, weight_vetting_whole, weight_vetting_whole_group} = req.body;

  /**
   *@WholeCluster
   */

  let BooleanInWholeCluster = weight_vetting_whole.map(item => item != '');

  const ClusterIndexStorage = [];
  for(let position =0; position < BooleanInWholeCluster.length; position++){
    if(BooleanInWholeCluster[position]){
        ClusterIndexStorage.push(position)
    }
  }

  const RespectiveWholeElements = ClusterIndexStorage.map(Index => {
    let findClusterName = weight_vetting_whole_group[Index];
    let findWeightage = weight_vetting_whole[Index];
    return {
      ClusterName: findClusterName,
      weightage : findWeightage,
      groupRequirement:true
    }
  })



  /**
   * @PartialCluster
   */
  let checkForBoolean = weight_vetting_partial.map(item => item != '');
  const IndexStorage = [];

  for(let position =0; position < checkForBoolean.length; position++){
    if(checkForBoolean[position]){
        IndexStorage.push(position)
    }
  }

  const RespectivePartialElements = IndexStorage.map(Index => {
    let findDesignation = ca_partial_weightage[Index];
    let findWeightage = weight_vetting_partial[Index];
    return {
      designation: findDesignation,
      weightage : findWeightage,
      groupRequirement:false
    }
  })




  /**
   * @FetchingAPI
   */
   const {currentEvent} = req.session;
   const { assessmentId } = currentEvent;
   try {


    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    CAPACITY_DATASET = CAPACITY_DATASET.filter(levels =>  levels['name'] === 'Service Capability')

    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
      const {weightingRange, options} = item;
      return options.map(subItem => {
        return {
          ...subItem, weightingRange
        }
      })
    }).flat();

    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map(item => {
      const optionID = item['option-id'];
      const {name, groups, weightingRange} = item;
      const groupname = name;
      return groups.map(group => {
        return {
          ...group,
          groupname,
          weightingRange,
          optionID
        }
      })
    }).flat()
   
    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map(item => item.name))]; 

    const CATEGORIZED_ACCORDING_DESIGNATION = [];


    for(const category of UNIQUE_DESIGNATION_CATEGORY){

      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter(item => {
        return item.name == category
      });
      const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
      const MAPPEDACCORDINGTOCATEGORY = {
        category,
        data: FINDRELEVANTCATEGORY,
        Weightage: Weightage
      }
      CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY)
    }


    let Level1DesignationStorageForHeadings = [];

    for(const desgination of CATEGORIZED_ACCORDING_DESIGNATION){
      const {Weightage, data, category} = desgination;
      const filteredLevel1Content = data.filter(role => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category
      }
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings.filter(designation => designation.data.length !== 0);



    const TableHeadings = Level1DesignationStorageForHeadings.map((item, index) => {
      return {
          "url": `#section${index}`,
          "text": item.category,
          "subtext": `${item.Weightage.min}% / ${item.Weightage.max}%`
      }
    })

    /**
     * Removing duplicated designations
     */  
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map(item => {
      const {Weightage, data, category} = item;
      const UNIQUESET = [...new Set(data.map(item => item.groupname))]; 
      const JOBSTORAGE = [];
      for(const uniqueItem of UNIQUESET){
        const filteredContents = data.filter(designation => designation.groupname === uniqueItem)[0];
        JOBSTORAGE.push(filteredContents);
      }
      return {Weightage, data: JOBSTORAGE.flat(), category};
    })

      /**
     * Levels 1 designaitons
     */
    
      let Level1DesignationStorage = [];

      for(const desgination of REMOVED_DUPLICATED_JOB){
        const {Weightage, data, category} = desgination;
        const filteredLevel1Content = data.filter(role => role.level === 1);
        const ReformedObject = {
          Weightage,
          data: filteredLevel1Content,
          category
        }
        Level1DesignationStorage.push(ReformedObject);
      }

      Level1DesignationStorage = Level1DesignationStorage.filter(designation => designation.data.length !== 0);


      //RespectiveWholeElements
      const FOUNDITEMSOFWHOLECLUSTER = RespectiveWholeElements.map(item => {
        const FIND_ITEM_IN_API = Level1DesignationStorage.filter(designation => designation['category'] == item.ClusterName);
        const DATA_IN_ITEM_IN_API = FIND_ITEM_IN_API[0].data;
        let totalItemLen = DATA_IN_ITEM_IN_API.length;
        let totalCLusterValue = item.weightage;
        let calculatedValue = totalCLusterValue / totalItemLen;
        let toPrecisionWeightage = calculatedValue.toFixed(2);
        return DATA_IN_ITEM_IN_API.map(subItems => {
          return {
            designation: subItems.groupname,
            weightage : toPrecisionWeightage,
            groupRequirement:true
          }
        })
      }).flat()



    const MAPPED_WHOLE_AND_PARTIAL_CLUSTER =  [...FOUNDITEMSOFWHOLECLUSTER].concat(RespectivePartialElements)
    
    



      console.log(MAPPED_WHOLE_AND_PARTIAL_CLUSTER)

     res.json(MAPPED_WHOLE_AND_PARTIAL_CLUSTER)






  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA learn page',
      true,
    );
  }

  /***
   *  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/51`, 'Completed');
    res.redirect('/ca/service-capabilities');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Post failed - CA learn page',
      true,
    );
  }
   * 
   */
 
};
