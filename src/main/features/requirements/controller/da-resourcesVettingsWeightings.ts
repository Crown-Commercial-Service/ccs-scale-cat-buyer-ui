//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as daResourcesVetting from '../../../resources/content/requirements/daResourcesVetting.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

//pricing 


/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const DA_GET_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID, _csrf } = req.cookies;
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
    designations,
    tableItems,
  } = req.session;
  const { assessmentId } = currentEvent;
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

  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];


    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    const CAPACITY_DATASET = CAPACITY_DATA.data;
    const dimensions = CAPACITY_DATASET;

  

  
    
    let DesignationLevelDimension = '';

    if(Number(EXTERNAL_ID) == 1) DesignationLevelDimension = 'Resource Quantities'
    else DesignationLevelDimension = 'Pricing';

    const DESIGNATIONCONTENTS = dimensions.filter(dimension => dimension['name'] === DesignationLevelDimension)[0];
    const STAFFWEIGHTAGECONTENTS = dimensions.filter(dimension => dimension['name'] === 'Resource Quantity')[0];
    const VETTINGWEIGTAGECONTENTS = dimensions.filter(dimension => dimension['name'] === 'Security Clearance')[0];

    const FormatedData = {
      options: [...DESIGNATIONCONTENTS['options'], ...STAFFWEIGHTAGECONTENTS['options'], ...VETTINGWEIGTAGECONTENTS['options']]
    }

    

    var { options } = FormatedData;

   /**
     * @Removing_duplications
     */
    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(options.map(item => item.name))];

    /**
     * @CLEANING_REMOVED_ITEMS
     */
    var UNIQUE_DESIG_STORAGE = [];

    for (const Item of UNIQUE_DESIGNATION_CATEGORY) {
      const FINDER = options.filter(nestedItem => nestedItem.name == Item)[0];
      UNIQUE_DESIG_STORAGE.push(FINDER);
    }

    UNIQUE_DESIG_STORAGE = UNIQUE_DESIG_STORAGE.flat();

    const REFORMED_DESIGNATION_OBJECT = {
      ...DESIGNATIONCONTENTS,
      options: UNIQUE_DESIG_STORAGE,
    };

    //REFORMATING
    var { options, name, type, weightingRange, evaluationCriteria } = REFORMED_DESIGNATION_OBJECT;
    let dimensionID = REFORMED_DESIGNATION_OBJECT['dimension-id'];

    const REMAPPED_ITEM = options.map(anOption => {
      const { name, groupRequirement, groups } = anOption;
      const REQ_ID = anOption['requirement-id'];
      const SFIA_NAME = name;
      return groups.map(nestedItems => {
        return {
          ...nestedItems,
          SFIA_name: SFIA_NAME,
          'requirement-id': REQ_ID,
          groupRequirement,
        };
      });
    });

    const FORMATTED_CHILD_REMAPPED_ITEMS = REMAPPED_ITEM.map(anOption => {
      const Parent = anOption.filter(level => level.level == 1);
      const Child = anOption.filter(level => level.level == 2);
      return Parent.map(nestedOptions => {
        return { ...nestedOptions, child: Child };
      })[0];
    });

    const REMAPPED_OBJECT = {
      ...REFORMED_DESIGNATION_OBJECT,
      options: FORMATTED_CHILD_REMAPPED_ITEMS,
    };

    /**
     * @FIND_UNIQUE_NAME
     */
    const UNIQUE_DESIGNATION_OF_PARENT = [...new Set(FORMATTED_CHILD_REMAPPED_ITEMS.map(item => item.name))];

    const DESIGNATION_MERGED_WITH_CHILD_STORAGE = [];

    for (const parent of UNIQUE_DESIGNATION_OF_PARENT) {
      const findElements = FORMATTED_CHILD_REMAPPED_ITEMS.filter(designation => designation.name == parent);
      let refactoredObject = {
        Parent: parent,
        category: findElements,
      };
      DESIGNATION_MERGED_WITH_CHILD_STORAGE.push(refactoredObject);
    }

    const REMAPPED_LEVEL1_CONTENTS = DESIGNATION_MERGED_WITH_CHILD_STORAGE.map(items => {
      return {
        Parent: items.Parent,
        category: items.category.map(subItems => subItems.child).flat(),
      };
    });

    const REMAPPED_ACCORDING_TO_PARENT_ROLE = REMAPPED_LEVEL1_CONTENTS.map(items => {
      const { category, Parent } = items;

      const UNIQUESTORAGE = [];
      const UNIQUE_ROLES = [...new Set(category.map(subitem => subitem.name))];

      for (const role of UNIQUE_ROLES) {
        let findBaseOnRoles = category.filter(i => i.name == role);
        let contructedObject = {
          ParentName: role,
          designations: findBaseOnRoles,
        };
        UNIQUESTORAGE.push(contructedObject);
      }

      return {
        Parent,
        category: UNIQUESTORAGE,
      };
    });

    const REMAPPTED_TABLE_ITEM_STORAGE = [];

    for (const i of tableItems) {
      for (const x of REMAPPED_ACCORDING_TO_PARENT_ROLE) {
        if (i.text == x.Parent) {
          const ReformedObj = {
            url: i.url,
            text: x.Parent,
            subtext: i.subtext,
          };
          REMAPPTED_TABLE_ITEM_STORAGE.push(ReformedObj);
        }
      }
    }

    /**
     * Sorting Designation According to the Table Items
     */

    var StorageForSortedItems = [];

    for (const items of REMAPPTED_TABLE_ITEM_STORAGE) {
      const Text = items.text;
      const findElementInRemapptedParentRole = REMAPPED_ACCORDING_TO_PARENT_ROLE.filter(
        cursor => cursor.Parent == Text,
      )[0];
      StorageForSortedItems.push(findElementInRemapptedParentRole);
    }





    //Resource Quantities values
    let ResouceQuantitiesDimensionVal = [];


    if(ALL_ASSESSTMENTS_DATA.dimensionRequirements != undefined){
    
      if(ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Resource Quantities').length > 0){
        ResouceQuantitiesDimensionVal = ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(d => d['name']=='Resource Quantities')[0].requirements;
        let newStorageForSortedItems = [];
        for(const items of StorageForSortedItems ){
          const {Parent, category} = items;
          const mappedSection = category.map(subItems => {
            let {designations, ParentName} = subItems;
            designations = designations.map(nestedItems => {
              const findInRequirement = ResouceQuantitiesDimensionVal.filter(i => i['requirement-id'] == nestedItems['requirement-id']);
              if(findInRequirement.length > 0) return {...nestedItems, weighting: findInRequirement[0].weighting}
              else return nestedItems;
            })
            return {
              designations,
              ParentName
            }
          })
          newStorageForSortedItems.push({Parent, category: mappedSection})
        }
        StorageForSortedItems = newStorageForSortedItems;
      }



      if(ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Security Clearance').length > 0){
        const SecurityGroup = ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Security Clearance')[0];
        const requirements = SecurityGroup['requirements'];
        const weighting = SecurityGroup['weighting'];

        let newStorageForSortedItems = [];
        for(const items of StorageForSortedItems ){
          const {Parent, category} = items;
          const mappedSection = category.map(subItems => {
            let {designations, ParentName} = subItems;
            const findRespectiveParent = requirements.filter(i => i['name'] == ParentName);
            if(findRespectiveParent.length > 0){
              return {
                designations,
                ParentName,
                weigthing : findRespectiveParent[0].weighting
              }
            }
            else  return {
              designations,
              ParentName
            }
           
          })
          newStorageForSortedItems.push({Parent, category: mappedSection})
        }
        StorageForSortedItems = newStorageForSortedItems;


      }



      if(ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Resource Quantity').length > 0){
        const ResourceGroup = ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Resource Quantity')[0];
        const weighting = ResourceGroup['weighting'];
        const requirements = ResourceGroup['requirements'];

       
        let newStorageForSortedItems = [];
        for(const items of StorageForSortedItems ){
          const {Parent, category} = items;
          const mappedSection = category.map(subItems => {
            let {designations, ParentName} = subItems;
            const findRespectiveParent = requirements.filter(i => i['name'] == ParentName);
            if(findRespectiveParent.length > 0){
              return {
                designations,
                ParentName,
                weigthing : findRespectiveParent[0].weighting
              }
            }
            else  return {
              designations,
              ParentName
            }
           
          })
          newStorageForSortedItems.push({Parent, category: mappedSection})
        }
        StorageForSortedItems = newStorageForSortedItems;
      }

    }
 



    
    const windowAppendData = {
      ...daResourcesVetting,
      lotId,
      agreementLotName,
      releatedContent,
      isError,
      errorText,
      designations: StorageForSortedItems,
      TableItems: REMAPPTED_TABLE_ITEM_STORAGE,

    };


    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    res.json(ALL_ASSESSTMENTS_DATA.dimensionRequirements.filter(i=> i['name']=='Resource Quantity')[0])
  // res.render('da-resourcesVettingWeightings', windowAppendData);
  } catch (error) {
    console.log(error)
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

export const DA_POST_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId } = req.session;
  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Not started');
  const { weight_staff, weight_vetting, weigthage_group_name, SFIA_weightage, requirement_Id_SFIA_weightage } =
    req.body;


 

  const SFIA_WEIGHTAGE_MAP = SFIA_weightage.map(item => item !== '');

  let IndexStorageForSFIA_LEVELS = [];

  for (var i = 0; i < SFIA_WEIGHTAGE_MAP.length; i++) {
    if (SFIA_WEIGHTAGE_MAP[i] == true) {
      IndexStorageForSFIA_LEVELS.push(i);
    }
  }

  const WeigtagewithRequirementId = IndexStorageForSFIA_LEVELS.map((item)=> {
    return {
      'requirement-id': Number(requirement_Id_SFIA_weightage[item]),
      'weighting': SFIA_weightage[item],
      "values":[]
    }
  })

  const WeigtageName = weigthage_group_name.map((item, index)=> {
    return {
      "staff-weigtage": weight_staff[index],
      "vetting-weigtage": weight_vetting[index],
      "group": item
    }
  }).filter(item => item['staff-weigtage'] !== '');




  const {
    currentEvent,
  } = req.session;
  const { assessmentId } = currentEvent;

 try {


  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
  const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
  const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

  const Weightings = ALL_ASSESSTMENTS_DATA.dimensionRequirements;
  const vetting_weightage = 20;
  // Weightings.filter(item => item.name == 'Service Capability')[0].weighting;

  const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];


  const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
  const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
  let CAPACITY_DATASET = CAPACITY_DATA.data;

  const LEVEL6CONTENTS = CAPACITY_DATASET.filter(dimension => dimension['name'] === 'Resource Quantity')[0];
  var { options } = LEVEL6CONTENTS;


  const findRequirementIdForWeigtageName = WeigtageName.map(group => {
    const groupName = group.group;
    const findReqId = options.filter(items => items['name'] == groupName)[0];
    const ReqId = findReqId['requirement-id'];
    return {
      ...group,
      'requirement-id': ReqId
    }
  })


 let DimensionForRequirements = 6;

 if(Number(EXTERNAL_ID) == 1) DimensionForRequirements = 7
 else DimensionForRequirements = 7;


 for(const item of findRequirementIdForWeigtageName){
   const reqId = item['requirement-id'];
    const D1_data = {"weighting": Number(item['staff-weigtage'])}
    const D2_data = {"weighting": Number(item['vetting-weigtage'])};
    //staff weightings is dimension 1, vetting is dimension 2
    const D1_BaseURL = `/assessments/${assessmentId}/dimensions/1/requirements/${reqId}`;
    const D2_BaseURL= `/assessments/${assessmentId}/dimensions/2/requirements/${reqId}`;
    await TenderApi.Instance(SESSION_ID).put(D1_BaseURL, D1_data);
    await TenderApi.Instance(SESSION_ID).put(D2_BaseURL, D2_data);
 }

 for(const item of WeigtagewithRequirementId){
  const reqId = item['requirement-id'];
  const weighting = item['weighting'];
  const BaseURL = `/assessments/${assessmentId}/dimensions/${DimensionForRequirements}/requirements/${reqId}`;
  let _RequestBody = {"weighting": Number(weighting)};
  await TenderApi.Instance(SESSION_ID).put(BaseURL, _RequestBody);
 }

  await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
  res.redirect('/da/resources-vetting-weightings');


  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Cannot Add requirements for Capability assessment',
      true,
    );
  }

};
