//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caResourcesVetting from '../../../resources/content/requirements/caResourcesVetting.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const CA_GET_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
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
    errorTextSumary,
    currentEvent,
    designations,
    tableItems,
    dimensions,
    choosenViewPath,    
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
    const assessmentDetail = await GET_ASSESSMENT_DETAIL(SESSION_ID, assessmentId);
    let dimensionSecurityClearance=[],dimensionResourceQuantity=[],dimensionResourceQuantities=[];
    if(assessmentDetail.dimensionRequirements.length>0){
      let dimensionRequirementsData=assessmentDetail.dimensionRequirements;
      dimensionSecurityClearance=dimensionRequirementsData.filter(item=>item["dimension-id"]==2);
      dimensionResourceQuantity=dimensionRequirementsData.filter(item=>item["dimension-id"]==1);
      dimensionResourceQuantities=dimensionRequirementsData.filter(item=>item["dimension-id"]==7);
    }
    const LEVEL7CONTENTS = dimensions.filter(dimension => dimension['name'] === 'Resource Quantities')[0];
    const LEVEL2CONTENTS = dimensions.filter(dimension => dimension['name'] === 'Security Clearance')[0];

    let Level7AndLevel2Contents = [...LEVEL7CONTENTS['options'], ...LEVEL2CONTENTS['options']];
    Level7AndLevel2Contents = { options: Level7AndLevel2Contents };

    var { options } = Level7AndLevel2Contents;

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
      ...LEVEL7CONTENTS,
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
      const refactoredObject = {
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
        const findBaseOnRoles = category.filter(i => i.name == role);
        const contructedObject = {
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

    /**   
 
       * 
       */

    const REMAPPTED_TABLE_ITEM_STORAGE = [];

    for (const i of tableItems) {
      for (const x of REMAPPED_ACCORDING_TO_PARENT_ROLE) {
        if (i.text == x.Parent) {
          const ReformedObj = {
            url: i.url,
            text: x.Parent,
            subtext: i.subtext,
            className: 'ca-vetting-weighting',
          };
          REMAPPTED_TABLE_ITEM_STORAGE.push(ReformedObj);
        }
      }
    }

    /**
     * Sorting Designation According to the Table Items
     */

    const StorageForSortedItems = [];

    for (const items of REMAPPTED_TABLE_ITEM_STORAGE) {
      const Text = items.text;
      const findElementInRemapptedParentRole = REMAPPED_ACCORDING_TO_PARENT_ROLE.filter(
        cursor => cursor.Parent == Text,
      )[0];
      StorageForSortedItems.push(findElementInRemapptedParentRole);
    }

    let requirementId,NumberStaff,NumberVetting;
    let total_ws=0,total_wv=0,total_res=0;
    for(var item of StorageForSortedItems){
      
      let inner_total_ws=0,inner_total_wv=0,inner_total_res=0;
      for(var cat of item.category)
      {
        requirementId=LEVEL2CONTENTS.options.filter(option=>option.name==cat.ParentName)?.[0]?.["requirement-id"];
        let noStaff=dimensionResourceQuantity[0].requirements.filter(req=>req["requirement-id"]==requirementId)[0]?.["weighting"];
        let noVetting=dimensionSecurityClearance[0].requirements.filter(req=>req["requirement-id"]==requirementId)[0]?.["weighting"];
        cat["ParentReqId"]=requirementId;
        cat["NumberStaff"]="";//0
        cat["NumberVetting"]="";//0
        if(noStaff!=undefined){
          cat["NumberStaff"]=noStaff;
          inner_total_ws=inner_total_ws+noStaff;
        }
        if(noVetting!=undefined){
          cat["NumberVetting"]=noVetting;
          inner_total_wv=inner_total_wv+noVetting;
        }
        for(var designation of cat.designations)
      {
        let res=dimensionResourceQuantities[0].requirements.filter(req=>req["requirement-id"]==designation["requirement-id"])[0]?.["weighting"];
        designation["NumberSFIA"]="";
        if(res!=undefined){
          designation["NumberSFIA"]=res.toString();
          inner_total_res=inner_total_res+res;
        }
      }

      }
      total_res=total_res+inner_total_res;
      total_wv=total_wv+inner_total_wv;
      total_ws=total_ws+inner_total_ws;
      let index=REMAPPTED_TABLE_ITEM_STORAGE.findIndex((obj:any)=>obj.text==item.Parent);
      REMAPPTED_TABLE_ITEM_STORAGE[index].subtext=inner_total_res+' resources added,'+inner_total_ws+' % / '+inner_total_wv+'%'
    }

    req.session["StorageForSortedItems"]=StorageForSortedItems;


    REMAPPTED_TABLE_ITEM_STORAGE.sort((a:any, b:any) => (a.text < b.text ? -1 : 1));
    StorageForSortedItems.sort((a:any, b:any) => (a.Parent < b.Parent ? -1 : 1))
    const windowAppendData = {
      ...caResourcesVetting,
      lotId,
      agreementLotName,
      releatedContent,
      isError,
      errorTextSumary:errorTextSumary,
      designations: StorageForSortedItems,
      choosenViewPath,
      TableItems: REMAPPTED_TABLE_ITEM_STORAGE,
      total_res,total_ws,total_wv
    };

    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'In progress');
    res.render('ca-resourcesVettingWeightings', windowAppendData);
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

export const CA_POST_RESOURCES_VETTING_WEIGHTINGS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId,StorageForSortedItems } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  const errorTextSumary = [];

  try {
    const { weight_staff, weight_vetting, weigthage_group_name, SFIA_weightage, requirement_Id_SFIA_weightage,weigthage_group_name_sfia,weigthage_reqid } =
      req.body;

    let isError=false;

    let isWeightStaffArrayEmpty=weight_staff.every(value=>value==='');
    let isWeightVettingArrayEmpty=weight_vetting.every(value=>value==='');
    let isSFIAweightageArrayEmpty=SFIA_weightage.every(value=>value==='');

    if(isWeightStaffArrayEmpty && isWeightVettingArrayEmpty && isSFIAweightageArrayEmpty)
    {
       isError=true;
      
      
      if(!errorTextSumary.find(i=>i.id==1))
     {
        errorTextSumary.push({ id: 1, text: 'At least 1 Role Family set of values are defined and 1 DDaT Role value is defined for that Role Family' });  
     }
    } 
    else{
    
    let total_weight_staff=0;
    let total_weight_vetting=0;
     
    let first=0;let end=0;
   
    
    StorageForSortedItems.forEach(element => {
      //first=0;end=0;
      element.category.forEach(category => {
        end=first+category.designations.length;
        let SFIA_weightage_subarray=SFIA_weightage.slice(first,end);
        if(SFIA_weightage_subarray.some(value=>value!='') && SFIA_weightage_subarray.some(value=>value==''))
        {
          if(!errorTextSumary.find(i=>i.id==2))
          {isError=true; errorTextSumary.push({ id: 2, text: 'All boxes in the Role Family must either be  empty or fully populated' });}
          
        }
        first=end;
      });
    });
  
 
    for (var i=0; i<weight_staff.length;i++){
      let data=parseInt(weight_staff[i]);
      if(isNaN(data) && weight_staff[i]!="")
      {
        if(!errorTextSumary.find(i=>i.id==3))
      {isError=true; errorTextSumary.push({ id: 3, text: 'All entry boxes are integer numeric' });}
      }
      if(!isNaN(data)){
        total_weight_staff=total_weight_staff+data;
        if(data>100)
        {
          if(!errorTextSumary.find(i=>i.id==4))
        {isError=true; errorTextSumary.push({ id: 4, text: 'Value entered in any [Weighting for number of staff] entry box <= 100' });}
        }
      }
    }

    for (var i=0; i<weight_vetting.length;i++){
      let data=parseInt(weight_vetting[i]);
      if(isNaN(data) && weight_vetting[i]!="")
      {
        if(!errorTextSumary.find(i=>i.id==3))
      {isError=true; errorTextSumary.push({ id: 3, text: 'All entry boxes are integer numeric' });}
      }
      if(!isNaN(data)){
      total_weight_vetting=total_weight_vetting+data;
      if(data>100)
      {
        if(!errorTextSumary.find(i=>i.id==5))
        {isError=true; errorTextSumary.push({ id: 5, text: 'Value entered in any [Weighting for related vetting requirement] entry box <= 100' });}
      
      }
    }
    }

    for (var i=0; i<SFIA_weightage.length;i++){
      let data=parseInt(SFIA_weightage[i]);
      if(isNaN(data) && SFIA_weightage[i]!="")
      {
        if(!errorTextSumary.find(i=>i.id==3))
      {isError=true; errorTextSumary.push({ id: 3, text: 'All entry boxes are integer numeric' });}
      }
      if(!isNaN(data)){
        //total_weight_staff=total_weight_staff+data;
        if(data>99)
        {
          if(!errorTextSumary.find(i=>i.id==6))
        {isError=true; errorTextSumary.push({ id: 6, text: 'Value entered in DDaT Role Quantity <= 99' });}
        }
      }
    }

    if(total_weight_staff!=100)
    {
       isError=true;
       errorTextSumary.push({ id: 7, text: 'The number of staff weightings for all Role Family entries must = 100%' });
    }

    if(total_weight_vetting!=100)
    {
       isError=true;
       errorTextSumary.push({ id: 8, text: 'The vetting requirement weightings for all Role Family entries must = 100%' });
    }
  }
  if(isError){
    req.session.errorTextSumary = errorTextSumary;
      req.session.isError = isError;
      req.session['isJaggaerError'] = true;
      res.redirect('/ca/resources-vetting-weightings');
    }
    else{
      req.session.errorTextSumary = [];
      req.session.isError = false;
      req.session['isJaggaerError'] = false;
    const Mapped_weight_staff = weight_staff.map(item => item !== '');
    let IndexStorage = [];

    for (var i = 0; i < Mapped_weight_staff.length; i++) {
      if (Mapped_weight_staff[i] == true) {
        IndexStorage.push(i);
      }
    }

    //subcontractor and dimensionweighting
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;

    const { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);

    const { dimensionRequirements } = assessments;
    let dimension2weighitng=10,dimension1weighitng=10;

    if(dimensionRequirements.length>0)

    {
      
       dimension2weighitng=dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2)[0].weighting;
       dimension1weighitng=dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 1)[0].weighting;

    }

   
    let subcontractorscheck;

      if(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2).length>0)

      {

        subcontractorscheck=(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2)[0].includedCriteria.

        find(x=>x["criterion-id"]==1))

      }

      let includedSubContractor=[];

      if(subcontractorscheck!=undefined)

      {

        includedSubContractor=[{ 'criterion-id': '1' }]

      }  

    let IndexStorageStaff = IndexStorage.map(Index => {
      const StaffWeightage = weight_staff[Index];
      // const StaffVetting = weight_vetting[Index];
      const GroupName = weigthage_group_name[Index];
      const reqId=weigthage_reqid[Index];
      return {
        "name": GroupName,
        "requirement-id": reqId,
        "weighting": StaffWeightage,
        "values":[]
      };
    });

    const dimension = req.session.dimensions;
  let resourcesData = dimension.filter(data => data["dimension-id"] === 1)[0];
  let body = {
    name: resourcesData['name'],
    weighting: dimension1weighitng,
    requirements: IndexStorageStaff,
    includedCriteria:includedSubContractor,
  };

  let response;
  //save number of staff data
  response=await TenderApi.Instance(SESSION_ID).put(
      `/assessments/${assessmentId}/dimensions/${resourcesData['dimension-id']}`,
      body,
    );
  
  if(response.status==HttpStatusCode.OK){
  let IndexStorageVetting = IndexStorage.map(Index => {
    const StaffVetting = weight_vetting[Index];
    const GroupName = weigthage_group_name[Index];
    const reqId=weigthage_reqid[Index];
    return {
      "name": GroupName,
      "requirement-id": reqId,
      "weighting": StaffVetting,
      "values":[]
    };
  });

  resourcesData = dimension.filter(data => data["dimension-id"] === 2)[0];
  body = {
    name: resourcesData['name'],
    weighting: dimension2weighitng,
    requirements: IndexStorageVetting,
    includedCriteria:includedSubContractor
  };

  //save number of vetting data
  response= await TenderApi.Instance(SESSION_ID).put(
    `/assessments/${assessmentId}/dimensions/${resourcesData['dimension-id']}`,
    body,
  );
  }
    if(response.status==HttpStatusCode.OK){
    const AllValuedSFIA_weightage = SFIA_weightage.map(items => items != '');
  const INDEX_FINDER_OBJ_REMAPPER = [];

  for (let start = 0; start < AllValuedSFIA_weightage.length; start++) {
    if (AllValuedSFIA_weightage[start]) {
      INDEX_FINDER_OBJ_REMAPPER.push({
        'name':weigthage_group_name_sfia[start],
        'requirement-id': requirement_Id_SFIA_weightage[start],
        weighting: SFIA_weightage[start],
        values: [],
      });
    }  
  }

  // const dimension = req.session.dimensions;
  resourcesData = dimension.filter(data => data["dimension-id"] === 7)[0];
  body = {
    name: resourcesData['name'],
    weighting: 0,
    includedCriteria: includedSubContractor,
    requirements: INDEX_FINDER_OBJ_REMAPPER,
  };
  

  //save number of resources
  response=await TenderApi.Instance(SESSION_ID).put(
    `/assessments/${assessmentId}/dimensions/${resourcesData['dimension-id']}`,
    body,
  );
  
  }
  if(response.status==HttpStatusCode.OK){
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Not started');
    res.redirect('/ca/choose-security-requirements');
  }
  else{
    res.redirect('/404');
  }
  }
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
};

const GET_ASSESSMENT_DETAIL = async (sessionId: any, assessmentId: string) => {
  const assessmentBaseUrl = `/assessments/${assessmentId}`;
  const assessmentApi = await TenderApi.Instance(sessionId).get(assessmentBaseUrl);
  return assessmentApi.data;
};