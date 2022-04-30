//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caResourcesVetting from '../../../resources/content/requirements/caResourcesVetting.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

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
    errorText,
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

    const windowAppendData = {
      ...caResourcesVetting,
      lotId,
      agreementLotName,
      releatedContent,
      isError,
      errorText,
      designations: StorageForSortedItems,
      choosenViewPath,
      TableItems: REMAPPTED_TABLE_ITEM_STORAGE,
    };

    // await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/48`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Not started');
    //res.json(dimensions)
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
  const { projectId } = req.session;

  try {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/49`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/50`, 'Not started');

    const { weight_staff, weight_vetting, weigthage_group_name, SFIA_weightage, requirement_Id_SFIA_weightage } =
      req.body;

    const Mapped_weight_staff = weight_staff.map(item => item !== '');
    let IndexStorage = [];

    for (var i = 0; i < Mapped_weight_staff.length; i++) {
      if (Mapped_weight_staff[i] == true) {
        IndexStorage.push(i);
      }
    }

    IndexStorage = IndexStorage.map(Index => {
      const StaffWeightage = weight_staff[Index];
      const StaffVetting = weight_vetting[Index];
      const GroupName = weigthage_group_name[Index];
      return {
        weigthage: StaffWeightage,
        Vetting_weight: StaffVetting,
        group_name: GroupName,
      };
    });

    const SFIA_WEIGHTAGE_MAP = SFIA_weightage.map(item => item !== '');

    let IndexStorageForSFIA_LEVELS = [];

    for (var i = 0; i < SFIA_WEIGHTAGE_MAP.length; i++) {
      if (Mapped_weight_staff[i] == true) {
        IndexStorageForSFIA_LEVELS.push(i);
      }
    }

    IndexStorageForSFIA_LEVELS = IndexStorageForSFIA_LEVELS.map(Index => {
      const requirement_id = requirement_Id_SFIA_weightage[Index];
      const SFIA_WEIGHTAGE = SFIA_weightage[Index];
      return {
        weigthage: SFIA_WEIGHTAGE,
        requirement_id: requirement_id,
      };
    });

    res.redirect('/ca/resources-vetting-weightings');
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
