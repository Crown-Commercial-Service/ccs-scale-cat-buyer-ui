//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as RFP_WEIGTING_JSON from '../../../resources/content/requirements/rfp-weighting.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_VETTING_AND_WEIGHTING = async (req: express.Request, res: express.Response) => {
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
        /**     const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];
         * 
         */
     
   

    const CAPACITY_BASEURL = `assessments/tools/1/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    const CAPACITY_DATASET = CAPACITY_DATA.data;
    
    const itemList = [
        'Data',
        'Technical',
        'IT Ops',
        'Product Delivery',
        'QAT',
        'User Centred Design',
        'No DDaT Cluster Mapping',
      ];
      
    const AddedWeigtagedtoCapacity = CAPACITY_DATASET.map(acapacity => {
        const { name, weightingRange, options } = acapacity;
        const AddedPropsToOptions = options.map(anOpt => {
          return {
            ...anOpt,
            Weightagename: name,
            Weightage: weightingRange,
          };
        });
        return AddedPropsToOptions;
      }).flat();
  
      const UNIQUEFIELDNAME = AddedWeigtagedtoCapacity.map(capacity => {
        return {
          designation: capacity.name,
          ...capacity?.groups?.[0],
          Weightagename: capacity.Weightagename,
          Weightage: capacity.Weightage,
        };
      });
  
      const UNIQUEELEMENTS_FIELDNAME = [...new Set(UNIQUEFIELDNAME.map(designation => designation.name))].map(cursor => {
        const ELEMENT_IN_UNIQUEFIELDNAME = UNIQUEFIELDNAME.filter(item => item.name === cursor);
        return {
          'job-category': cursor,
          data: ELEMENT_IN_UNIQUEFIELDNAME,
        };
      });
      const filteredMenuItem = UNIQUEELEMENTS_FIELDNAME.filter(item => itemList.includes(item['job-category']));
  
      const ITEMLIST = filteredMenuItem.map((designation, index) => {
        const weightage = designation.data?.[0]?.Weightage;
        return {
          url: `#section${index + 1}`,
          text: designation['job-category'],
          subtext: `${weightage.min}% / ${weightage.max}%`,
        };
      });


      const tableItems = [...ITEMLIST];
  
    var dimensions = [...CAPACITY_DATASET];
  
  
      const LEVEL7CONTENTS = dimensions.filter(dimension => dimension['name'] === 'Resource Quantities')[0];
      var {options} = LEVEL7CONTENTS;
  
      /**
       * @Removing_duplications
       */
       const UNIQUE_DESIGNATION_CATEGORY = [...new Set(options.map(item => item.name))]; 
  
       /**
        * @CLEANING_REMOVED_ITEMS
        */
       var UNIQUE_DESIG_STORAGE = [];
  
       for(const Item of UNIQUE_DESIGNATION_CATEGORY){
         const FINDER = options.filter(nestedItem => nestedItem.name == Item)[0];
         UNIQUE_DESIG_STORAGE.push(FINDER);
       }
  
       UNIQUE_DESIG_STORAGE = UNIQUE_DESIG_STORAGE.flat();
  
       const REFORMED_DESIGNATION_OBJECT = {
         ...LEVEL7CONTENTS, options: UNIQUE_DESIG_STORAGE
       }
  
       //REFORMATING
       var {options, name, type, weightingRange, evaluationCriteria} = REFORMED_DESIGNATION_OBJECT;
       let dimensionID = REFORMED_DESIGNATION_OBJECT['dimension-id'];
  
       const REMAPPED_ITEM = options.map(anOption => {
        const {name, groupRequirement, groups} = anOption;
        const REQ_ID = anOption['requirement-id'];
        const SFIA_NAME = name;
        return groups.map(nestedItems => {
          return {
            ...nestedItems,
            SFIA_name: SFIA_NAME,
            'requirement-id': REQ_ID,
            groupRequirement
          }
        })
  
       })
  
  
       const FORMATTED_CHILD_REMAPPED_ITEMS = REMAPPED_ITEM.map(anOption => {
        const Parent = anOption.filter(level => level.level == 1);
        const Child = anOption.filter(level => level.level == 2);
        return Parent.map(nestedOptions => {
          return {...nestedOptions, child: Child }
        })[0];
       })
  
       const REMAPPED_OBJECT = {
        ...REFORMED_DESIGNATION_OBJECT,
        options: FORMATTED_CHILD_REMAPPED_ITEMS
      }
  
  
          /**
       * @FIND_UNIQUE_NAME
       */
        const UNIQUE_DESIGNATION_OF_PARENT= [...new Set(FORMATTED_CHILD_REMAPPED_ITEMS.map(item => item.name))];
        
        const DESIGNATION_MERGED_WITH_CHILD_STORAGE =[];
  
        for(const parent of UNIQUE_DESIGNATION_OF_PARENT){
  
          const findElements = FORMATTED_CHILD_REMAPPED_ITEMS.filter(designation => designation.name == parent);
          let refactoredObject = {
            Parent: parent,
            category : findElements
          }
          DESIGNATION_MERGED_WITH_CHILD_STORAGE.push(refactoredObject);
  
        }
  
        const REMAPPED_LEVEL1_CONTENTS = DESIGNATION_MERGED_WITH_CHILD_STORAGE.map(items => {
          return {
            Parent: items.Parent,
            category : items.category.map(subItems => subItems.child).flat()
          }
        })
  
  
        const REMAPPED_ACCORDING_TO_PARENT_ROLE = REMAPPED_LEVEL1_CONTENTS.map(items => {
          const {category, Parent} = items;
  
          const UNIQUESTORAGE = [];
          const UNIQUE_ROLES= [...new Set(category.map(subitem => subitem.name))];
  
  
          for(const role of UNIQUE_ROLES){
            let findBaseOnRoles = category.filter(i => i.name == role );
            let contructedObject = {
              ParentName : role,
              designations: findBaseOnRoles
            }
            UNIQUESTORAGE.push(contructedObject);
          }
  
          return {
            Parent,
            category: UNIQUESTORAGE
          }
  
        });
  

  
        const REMAPPTED_TABLE_ITEM_STORAGE = [];
  
        for(const i of tableItems){
          for(const x of REMAPPED_ACCORDING_TO_PARENT_ROLE ){
            if(i.text == x.Parent){
              const ReformedObj = {
                url: i.url,
                text: x.Parent,
                subtext: i.subtext,
              }
              REMAPPTED_TABLE_ITEM_STORAGE.push(ReformedObj)
            }
          }
        }
  
        
     
     
          /**
           * Sorting Designation According to the Table Items 
           */
  
        const StorageForSortedItems = [];
  
        for(const items of REMAPPTED_TABLE_ITEM_STORAGE){
          const Text = items.text;
          const findElementInRemapptedParentRole = REMAPPED_ACCORDING_TO_PARENT_ROLE.filter(cursor => cursor.Parent == Text)[0];
          StorageForSortedItems.push(findElementInRemapptedParentRole);
        }
  
  
        const windowAppendData = {
          ...RFP_WEIGTING_JSON,
          lotId,
          agreementLotName,
          releatedContent,
          isError,
          errorText,
          designations: StorageForSortedItems,
          TableItems: REMAPPTED_TABLE_ITEM_STORAGE,
        };
     
  
     // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    //res.json({StorageForSortedItems, REMAPPTED_TABLE_ITEM_STORAGE})
    res.render('rfp-vetting-weighting', windowAppendData);
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

}



export const RFP_POST_VETTING_AND_WEIGHTING = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { projectId } = req.session;

    res.json({msg: 'welocme'})
}