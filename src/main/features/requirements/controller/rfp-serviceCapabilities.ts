//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as RFPService from '../../../resources/content/requirements/rfpService.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';

/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
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

  //const assessmentId = 1;
  const { assessmentId } = currentEvent;
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = 1;

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    CAPACITY_DATASET = CAPACITY_DATASET.filter(levels => levels['name'] === 'Service Capability');

    let CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
      const { weightingRange, options } = item;
      return options.map(subItem => {
        return {
          ...subItem,
          weightingRange,
        };
      });
    }).flat();

    //Setting the data that have groupRequirement = true;
    const CAPACITY_CONCAT_Heading = CAPACITY_CONCAT_OPTIONS.filter(
      designation => designation.groupRequirement === true,
    );

    //
    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS.map(item => {
      const optionID = item['option-id'];
      const { name, groups, groupRequirement, weightingRange } = item;
      const requirementId = item['requirement-id'];
      const groupname = name;
      return groups.map(group => {
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

    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS.map(item => item.name))];

    const CATEGORIZED_ACCORDING_DESIGNATION = [];

    for (const category of UNIQUE_DESIGNATION_CATEGORY) {
      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS.filter(item => {
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
      const filteredLevel1Content = data.filter(role => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings.filter(
      designation => designation.data.length !== 0,
    );

    const TableHeadings = Level1DesignationStorageForHeadings.map((item, index) => {
      return {
        url: `#section${index}`,
        text: item.category,
        subtext: `${item.Weightage.min}% / ${item.Weightage.max}%`,
      };
    });

    /**
     * Removing duplicated designations
     */
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION.map(item => {
      const { Weightage, data, category } = item;
      const UNIQUESET = [...new Set(data.map(item => item.groupname))];
      const JOBSTORAGE = [];
      for (const uniqueItem of UNIQUESET) {
        const filteredContents = data.filter(designation => designation.groupname === uniqueItem)[0];
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
      const filteredLevel1Content = data.filter(role => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorage.push(ReformedObject);
    }

    Level1DesignationStorage = Level1DesignationStorage.filter(designation => designation.data.length !== 0);

    /**
     * @ASSESSMENT_API_REQUEST
     * @DIMENSION_REQUIREMENT
     */
    let { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;
    dimensionRequirements = dimensionRequirements.filter(item => item.name == 'Resource Quantity');
    const DRequirements = dimensionRequirements?.[0]?.requirements;

    var TABLEBODY = [];

    /**
     *

     */

    if (dimensionRequirements?.[0]?.requirements != undefined) {
      const FilledDATASTORGE = Level1DesignationStorage.map(items => {
        const { category, data, Weightage } = items;
        const allignedItems = items;
        const newlyFormedData = data.map(nestedItems => {
          var ReformedObj = {};
          const findInDRequirement = DRequirements.filter(x => x.name == nestedItems.groupname);
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

    const UNIQUE_DESIGNATION_HEADINGS = [...new Set(CAPACITY_CONCAT_Heading.map(item => item.name))];

    const UNIQUE_DESIGNATION_HEADINGS_ARR = UNIQUE_DESIGNATION_HEADINGS.map(designation => {
      const findDesgination = CAPACITY_CONCAT_Heading.filter(item => item.name == designation)[0];
      return findDesgination;
    });

    /***
      * 
      * @WHOLECLUSTER_HEADINGS
    
      */

    var WHOLECLUSTERCELLS = [];

    if (dimensionRequirements?.[0]?.requirements != undefined) {
      const reformedWholeClusterArr = UNIQUE_DESIGNATION_HEADINGS_ARR.map(items => {
        const findInDRequirement = DRequirements.filter(x => x.name == items.name);
        var ReformedObj = {};
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

    req.session.serviceCapabilityData = Level1DesignationStorage;
    const TotalAdded = DRequirements?DRequirements.length:0;

    const windowAppendData = {
      ...RFPService,
      lotId,
      agreementLotName,
      releatedContent,
      isError,
      errorText,
      TABLE_HEADING: TableHeadings,
      TABLE_BODY: TABLEBODY,
      WHOLECLUSTER: WHOLECLUSTERCELLS,
      //totalAdded: TotalAdded,
    };
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/35`, 'In progress');
    //res.json(dataset);
    res.render('rfp-servicecapabilities.njk', windowAppendData);
  } catch (error) {
    console.log(error);
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
 export const RFP_POST_SERVICE_CAPABILITIES = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, serviceCapabilityData,currentEvent } = req.session;
  const { requirementId } = req.body;

  const MappedServiceCapData = serviceCapabilityData.map(items => items.data).flat();
  var MappedRequestContainingID = [];
  var individualWeigtage = 0;

  if (Array.isArray(requirementId)) {
    MappedRequestContainingID = requirementId.map(item => {
      const findElement = MappedServiceCapData.filter(x => x['requirement-id'] == item)[0];
      return findElement;
    });
    individualWeigtage = (100 / MappedRequestContainingID.length).toFixed(1);
  } else {
    MappedRequestContainingID = MappedServiceCapData.filter(x => x['requirement-id'] == requirementId);
    individualWeigtage = 100;
  }

  MappedRequestContainingID = MappedRequestContainingID.map(item => {
    return {
      'requirement-id': item['requirement-id'],
      weighting: Math.floor(individualWeigtage) + 1,
      values: [],
    };
  });

  const PUT_BODY = {
    weighting: 10,
    includedCriteria: [],
   
    requirements: MappedRequestContainingID,
  };

  try {
    //const assessmentId = 1;
    const { assessmentId } = currentEvent;
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = 1;

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    const DIMENSION_ID = CAPACITY_DATASET[2]['dimension-id'];
    const BASEURL_FOR_PUT = `/assessments/${assessmentId}/dimensions/${DIMENSION_ID}`;
    const POST_CHOOSEN_VALUES = await TenderApi.Instance(SESSION_ID).put(BASEURL_FOR_PUT, PUT_BODY);
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/35`, 'Completed');
    await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/36`, 'Not started');
    res.redirect('/rfp/where-work-done');
  } catch (error) {
    console.log(error);
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      `Error occured in Tender Service while adding Requirements for the assessment`,
      true,
    );
  }
};


