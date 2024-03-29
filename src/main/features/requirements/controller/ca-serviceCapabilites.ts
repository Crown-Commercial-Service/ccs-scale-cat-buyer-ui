//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as caService from '../../../resources/content/requirements/caService.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';

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
    eventId,
    agreement_id,
    releatedContent,
    project_name,
    isError,
    errorText,
    currentEvent,
    choosenViewPath,
  } = req.session;
  const agreementId_session = agreement_id;
  const { isJaggaerError } = req.session;
  const lotid = req.session?.lotId;
  req.session['isJaggaerError'] = false;
  res.locals.agreement_header = {
    agreementName,
    project_name,
    agreementId_session,
    agreementLotName,
    lotid,
    error: isJaggaerError,
  };

  const { assessmentId } = currentEvent;
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

    //const Weightings = ALL_ASSESSTMENTS_DATA.dimensionRequirements;
    //const Service_capbility_weightage = Weightings.filter(item => item.name == 'Service Capability')[0].weighting;

    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    CAPACITY_DATASET = CAPACITY_DATASET.filter((levels) => levels['name'] === 'Service Capability');

    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map((item) => {
      const { weightingRange, options } = item;
      return options.map((subItem) => {
        return {
          ...subItem,
          weightingRange,
        };
      });
    }).flat();

    //Setting the data that have groupRequirement = true;
    const CAPACITY_CONCAT_Heading = CAPACITY_CONCAT_OPTIONS.filter(
      (designation) => designation.groupRequirement === true
    );

    //
    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map((item) => {
      const optionID = item['option-id'];
      const { name, groups, groupRequirement, weightingRange } = item;
      const requirementId = item['requirement-id'];
      const groupname = name;
      return groups.map((group) => {
        return {
          ...group,
          groupname,
          weightingRange,
          groupRequirement,
          optionID,
          'requirement-id': requirementId,
        };
      });
    }).flat();

    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map((item) => item.name))];

    const CATEGORIZED_ACCORDING_DESIGNATION = [];

    for (const category of UNIQUE_DESIGNATION_CATEGORY) {
      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter((item) => {
        return item.name == category;
      });
      const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
      const MAPPEDACCORDINGTOCATEGORY = {
        category,
        data: FINDRELEVANTCATEGORY,
        Weightage: Weightage,
      };
      CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY);
    }

    let Level1DesignationStorageForHeadings = [];

    for (const desgination of CATEGORIZED_ACCORDING_DESIGNATION) {
      const { Weightage, data, category } = desgination;
      const filteredLevel1Content = data.filter((role) => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings.filter(
      (designation) => designation.data.length !== 0
    );

    const { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;
    const requirements = dimensionRequirements?.filter((x) => x['dimension-id'] == 3)[0]?.requirements;

    const TableHeadings = Level1DesignationStorageForHeadings.map((item, index) => {
      let totalAddedWeighting = 0;

      const headingReqId = CAPACITY_CONCAT_OPTIONS.filter((x) => x.name == item.category)[0];
      const tempWeighting = requirements?.filter((x) => x['requirement-id'] == headingReqId['requirement-id'])[0]
        ?.weighting;

      if (tempWeighting != undefined && tempWeighting != null) totalAddedWeighting = tempWeighting;
      else {
        const { data } = item;
        data?.map((req) => {
          const weighting = requirements?.filter((x) => x['requirement-id'] == req['requirement-id'])[0]?.weighting;
          if (weighting != null && weighting != undefined) totalAddedWeighting = totalAddedWeighting + weighting;
        });
      }
      return {
        url: `#section${index}`,
        text: item.category,
        subtext: '[ ' + totalAddedWeighting + ' % ]',
        className: 'ca-service-capabilities',
      };
    });

    /**
     * Removing duplicated designations
     */
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map((item) => {
      const { Weightage, data, category } = item;
      const UNIQUESET = [...new Set(data.map((item) => item.groupname))];
      const JOBSTORAGE = [];
      for (const uniqueItem of UNIQUESET) {
        const filteredContents = data.filter((designation) => designation.groupname === uniqueItem)[0];
        JOBSTORAGE.push(filteredContents);
      }
      return { Weightage, data: JOBSTORAGE.flat(), category };
    });

    /**
     * Levels 1 designaitons
     */

    let Level1DesignationStorage = [];

    for (const desgination of REMOVED_DUPLICATED_JOB) {
      const { Weightage, data, category } = desgination;
      const filteredLevel1Content = data.filter((role) => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorage.push(ReformedObject);
    }

    Level1DesignationStorage = Level1DesignationStorage.filter((designation) => designation.data.length !== 0);

    /**
     * @ASSESSMENT_API_REQUEST
     * @DIMENSION_REQUIREMENT
     */
    let DRequirements;
    let totalWeighting = 0;

    if (dimensionRequirements != null && dimensionRequirements !== undefined && dimensionRequirements.length > 0) {
      const dimension = dimensionRequirements?.filter((dimension) => dimension['dimension-id'] === 3);
      DRequirements = dimension?.[0]?.requirements;
      DRequirements.map((x) => {
        totalWeighting = totalWeighting + x.weighting;
      });
    }

    let TABLEBODY = [];

    /**
     *

     */

    if (dimensionRequirements?.[0]?.requirements != undefined) {
      const FilledDATASTORGE = Level1DesignationStorage.map((items) => {
        const { category, data, Weightage } = items;
        const allignedItems = items;
        const newlyFormedData = data.map((nestedItems) => {
          let ReformedObj = {};
          const findInDRequirement = DRequirements.filter((x) => x.name == nestedItems.groupname);
          if (findInDRequirement.length > 0) {
            const weigtage = findInDRequirement[0].weighting;
            ReformedObj = { ...nestedItems, value: weigtage };
          } else ReformedObj = { ...nestedItems, value: '' };
          return ReformedObj;
        });
        return {
          category,
          data: newlyFormedData,
          Weightage,
        };
      });

      TABLEBODY = FilledDATASTORGE;
    } else {
      TABLEBODY = Level1DesignationStorage;
    }

    /**
     *@UNIQUE_HEADINGS
     */

    const UNIQUE_DESIGNATION_HEADINGS = [...new Set(CAPACITY_CONCAT_Heading.map((item) => item.name))];

    const UNIQUE_DESIGNATION_HEADINGS_ARR = UNIQUE_DESIGNATION_HEADINGS.map((designation) => {
      const findDesgination = CAPACITY_CONCAT_Heading.filter((item) => item.name == designation)[0];
      return findDesgination;
    });

    /***
      * 
      * @WHOLECLUSTER_HEADINGS
    
      */

    let WHOLECLUSTERCELLS = [];

    if (dimensionRequirements?.[0]?.requirements != undefined) {
      const reformedWholeClusterArr = UNIQUE_DESIGNATION_HEADINGS_ARR.map((items) => {
        const findInDRequirement = DRequirements.filter((x) => x.name == items.name);
        let ReformedObj = {};
        if (findInDRequirement.length > 0) {
          const weigtage = findInDRequirement[0].weighting;
          ReformedObj = { ...items, value: weigtage };
        } else ReformedObj = { ...items, value: '' };
        return ReformedObj;
      });
      WHOLECLUSTERCELLS = reformedWholeClusterArr;
    } else {
      WHOLECLUSTERCELLS = UNIQUE_DESIGNATION_HEADINGS_ARR;
    }

    const windowAppendData = {
      ...caService,
      choosenViewPath,
      totalWeighting,
      lotid,
      agreementLotName,
      releatedContent,
      isError,
      errorText,
      TABLE_HEADING: TableHeadings,
      TABLE_BODY: TABLEBODY,
      WHOLECLUSTER: WHOLECLUSTERCELLS,
    };
    const flag = await ShouldEventStatusBeUpdated(eventId, 50, req);
    if (flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/50`, 'In progress');
    }

    //res.json(UNIQUE_DESIGNATION_HEADINGS_ARR)
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
      true
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
  const { projectId, eventId } = req.session;

  const { ca_partial_weightage, weight_vetting_partial, weight_vetting_whole, weight_vetting_whole_group } = req.body;

  /**
   *@WholeCluster
   */

  const BooleanInWholeCluster = weight_vetting_whole.map((item) => item != '');

  const ClusterIndexStorage = [];
  for (let position = 0; position < BooleanInWholeCluster.length; position++) {
    if (BooleanInWholeCluster[position]) {
      ClusterIndexStorage.push(position);
    }
  }

  const RespectiveWholeElements = ClusterIndexStorage.map((Index) => {
    const findClusterName = weight_vetting_whole_group[Index];
    const findWeightage = weight_vetting_whole[Index];
    return {
      ClusterName: findClusterName,
      weightage: findWeightage,
      groupRequirement: true,
    };
  });

  /**
   * @PartialCluster
   */
  const checkForBoolean = weight_vetting_partial.map((item) => item != '');
  const IndexStorage = [];

  for (let position = 0; position < checkForBoolean.length; position++) {
    if (checkForBoolean[position]) {
      IndexStorage.push(position);
    }
  }

  const RespectivePartialElements = IndexStorage.map((Index) => {
    const findDesignation = ca_partial_weightage[Index];
    const findWeightage = weight_vetting_partial[Index];
    return {
      designation: findDesignation,
      weightage: findWeightage,
      groupRequirement: false,
    };
  });

  /**
   * @FetchingAPI
   */
  const { currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

    let Service_capbility_weightage = 10;

    const Weightings = ALL_ASSESSTMENTS_DATA.dimensionRequirements;

    if (typeof Weightings !== 'undefined' && Weightings.length > 0) {
      Service_capbility_weightage = Weightings?.filter((item) => item.name == 'Service Capability')[0].weighting;
    }

    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    CAPACITY_DATASET = CAPACITY_DATASET.filter((levels) => levels['name'] === 'Service Capability');

    const CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map((item) => {
      const { weightingRange, options } = item;
      return options.map((subItem) => {
        return {
          ...subItem,
          weightingRange,
        };
      });
    }).flat();

    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map((item) => {
      const optionID = item['option-id'];
      const { name, groups, weightingRange } = item;
      const groupname = name;
      return groups.map((group) => {
        return {
          ...group,
          groupname,
          weightingRange,
          optionID,
        };
      });
    }).flat();

    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map((item) => item.name))];

    const CATEGORIZED_ACCORDING_DESIGNATION = [];

    for (const category of UNIQUE_DESIGNATION_CATEGORY) {
      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter((item) => {
        return item.name == category;
      });
      const Weightage = FINDRELEVANTCATEGORY?.[0]?.weightingRange;
      const MAPPEDACCORDINGTOCATEGORY = {
        category,
        data: FINDRELEVANTCATEGORY,
        Weightage: Weightage,
      };
      CATEGORIZED_ACCORDING_DESIGNATION.push(MAPPEDACCORDINGTOCATEGORY);
    }

    let Level1DesignationStorageForHeadings = [];

    for (const desgination of CATEGORIZED_ACCORDING_DESIGNATION) {
      const { Weightage, data, category } = desgination;
      const filteredLevel1Content = data.filter((role) => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings.filter(
      (designation) => designation.data.length !== 0
    );

    /**
     * Removing duplicated designations
     */
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map((item) => {
      const { Weightage, data, category } = item;
      const UNIQUESET = [...new Set(data.map((item) => item.groupname))];
      const JOBSTORAGE = [];
      for (const uniqueItem of UNIQUESET) {
        const filteredContents = data.filter((designation) => designation.groupname === uniqueItem)[0];
        JOBSTORAGE.push(filteredContents);
      }
      return { Weightage, data: JOBSTORAGE.flat(), category };
    });

    /**
     * Levels 1 designaitons
     */

    let Level1DesignationStorage = [];

    for (const desgination of REMOVED_DUPLICATED_JOB) {
      const { Weightage, data, category } = desgination;
      const filteredLevel1Content = data.filter((role) => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorage.push(ReformedObject);
    }

    Level1DesignationStorage = Level1DesignationStorage.filter((designation) => designation.data.length !== 0);

    //RespectiveWholeElements

    /**
     *
     */
    const FOUNDITEMSOFWHOLECLUSTER = RespectiveWholeElements.map((item) => {
      const FIND_ITEM_IN_API = Level1DesignationStorage.filter(
        (designation) => designation['category'] == item.ClusterName
      );
      const MappedArrays = FIND_ITEM_IN_API.map((nestItem) => {
        return {
          ...nestItem,
          weightage: item.weightage,
        };
      });

      return MappedArrays;
    }).flat();

    const FindRespectiveRequirementID = FOUNDITEMSOFWHOLECLUSTER.map((item) => {
      const { category, weightage } = item;
      const CapacityData = CAPACITY_DATASET[0].options;
      const ToggledTrue = CapacityData.filter((nestedItem) => nestedItem.groupRequirement == true);
      const FoundElement = ToggledTrue.filter((nestedItem) => nestedItem.name == category)[0];
      return {
        Weightage: weightage,
        ...FoundElement,
      };
    });

    const FindIndividualItemsID = RespectivePartialElements.map((item) => {
      const { designation, weightage } = item;
      const CapacityData = CAPACITY_DATASET[0].options;
      const ToggledTrue = CapacityData.filter((nestedItem) => nestedItem.groupRequirement == false);
      const FoundElement = ToggledTrue.filter((nestedItem) => nestedItem.name == designation)[0];
      return {
        Weightage: weightage,
        ...FoundElement,
      };
    });

    let MappedWholeAndPartialCluster = FindRespectiveRequirementID.concat(FindIndividualItemsID);
    MappedWholeAndPartialCluster = MappedWholeAndPartialCluster.map((item) => {
      const { Weightage } = item;
      const requirementId = item['requirement-id'];
      const PostedFormElement = {};
      (PostedFormElement['requirement-id'] = requirementId), (PostedFormElement['weighting'] = Weightage);
      PostedFormElement['values'] = [];
      return PostedFormElement;
    });
    let subcontractorscheck;

    if (Weightings?.filter((dimension) => dimension['dimension-id'] === 3).length > 0) {
      subcontractorscheck = Weightings?.filter((dimension) => dimension['dimension-id'] === 3)[0].includedCriteria.find(
        (x) => x['criterion-id'] == 1
      );
    }
    let includedSubContractor = [];
    if (subcontractorscheck != undefined) {
      includedSubContractor = [{ 'criterion-id': '1' }];
    }
    const PUT_BODY = {
      weighting: Service_capbility_weightage,
      includedCriteria: includedSubContractor,
      overwriteRequirements: true,
      requirements: MappedWholeAndPartialCluster,
    };

    /**
     * @DATA_POST
     */

    try {
      const DIMENSION_ID = CAPACITY_DATASET[0]['dimension-id'];
      const BASEURL_FOR_PUT = `/assessments/${assessmentId}/dimensions/${DIMENSION_ID}`;
      const POST_CHOOSEN_VALUES = await TenderApi.Instance(SESSION_ID).put(BASEURL_FOR_PUT, PUT_BODY);

      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/50`, 'Completed');
      const flag = await ShouldEventStatusBeUpdated(eventId, 51, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/51`, 'Not started');
      }
      if (req.session['CA_nextsteps_edit']) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/54`, 'Not started');
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/55`, 'Cannot start yet');
      }
      res.redirect('/ca/team-scale');
    } catch (error) {
      req.session['isJaggaerError'] = true;
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Error occured in Tender Service while adding Requirements for the assessment',
        true
      );
    }

    /**
     *
     */
  } catch (error) {
    req.session['isJaggaerError'] = true;
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - Get failed - CA learn page',
      true
    );
  }
};
