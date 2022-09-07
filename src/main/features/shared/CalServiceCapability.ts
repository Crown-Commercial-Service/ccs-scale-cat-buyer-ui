//@ts-nocheck
import express from 'express';
import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';

export const CalServiceCapability = async (req: express.Request) => {
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
  const { assessmentId } = currentEvent;
  const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;
    const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];;

    const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;
    const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);
    let CAPACITY_DATASET = CAPACITY_DATA.data;

    CAPACITY_DATASET = CAPACITY_DATASET?.filter(levels => levels['name'] === 'Service Capability');

    let CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET?.map(item => {
      const { weightingRange, options } = item;
      return options?.map(subItem => {
        return {
          ...subItem,
          weightingRange,
        };
      });
    }).flat();

    //Setting the data that have groupRequirement = true;
    const CAPACITY_CONCAT_Heading = CAPACITY_CONCAT_OPTIONS?.filter(
      designation => designation.groupRequirement === true,
    );

    //
    const UNIQUE_GROUPPED_ITEMS = CAPACITY_CONCAT_OPTIONS?.map(item => {
      const optionID = item['option-id'];
      const { name, groups, groupRequirement, weightingRange } = item;
      const requirementId = item['requirement-id'];
      const groupname = name;
      return groups?.map(group => {
        return {
          ...group,
          groupname,
          weightingRange,
          groupRequirement,
          optionID,
          'requirement-id': requirementId,
          value:''
        };
      });
    }).flat();

    const UNIQUE_DESIGNATION_CATEGORY = [...new Set(UNIQUE_GROUPPED_ITEMS?.map(item => item.name))];

    const CATEGORIZED_ACCORDING_DESIGNATION = [];

    for (const category of UNIQUE_DESIGNATION_CATEGORY) {
      const FINDRELEVANTCATEGORY = UNIQUE_GROUPPED_ITEMS?.filter(item => {
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
      const filteredLevel1Content = data?.filter(role => role.level === 1);
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,
      };
      Level1DesignationStorageForHeadings.push(ReformedObject);
    }

    Level1DesignationStorageForHeadings = Level1DesignationStorageForHeadings?.filter(
      designation => designation.data.length !== 0,
    );

    let TableHeadings = Level1DesignationStorageForHeadings?.map((item, index) => {
      return {
        url: `#section${index}`,
        text: item.category,
        subtext: `[0 selected]`,
        className: 'rfp-service-capabilities'
      };
    });

    /**
     * Removing duplicated designations
     */
    const REMOVED_DUPLICATED_JOB = CATEGORIZED_ACCORDING_DESIGNATION?.map(item => {
      const { Weightage, data, category } = item;
      const UNIQUESET = [...new Set(data.map(item => item.groupname))];
      const JOBSTORAGE = [];
      for (const uniqueItem of UNIQUESET) {
        const filteredContents = data?.filter(designation => designation.groupname === uniqueItem)[0];
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
      const filteredLevel1Content = data?.filter(role => role.level === 1);    
      const ReformedObject = {
        Weightage,
        data: filteredLevel1Content,
        category,      
      };
      Level1DesignationStorage.push(ReformedObject);
    }

   
    Level1DesignationStorage = Level1DesignationStorage?.filter(designation => designation.data.length !== 0);

    /**
     * @ASSESSMENT_API_REQUEST
     * @DIMENSION_REQUIREMENT
     */
   const { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;
    const DR = dimensionRequirements?.filter(dimension => dimension.name === 'Service Capability');
    const DRequirements = DR?.[0]?.requirements;

    var TABLEBODY = [];

    if (DR?.[0]?.requirements != undefined) {
      const FilledDATASTORGE = Level1DesignationStorage?.map(items => {
        const { category, data, Weightage } = items;
        const allignedItems = items;
        const newlyFormedData = data.map(nestedItems => {
          var ReformedObj = {};
          const findInDRequirement = DRequirements?.filter(x => x.name == nestedItems.groupname);
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
    TableHeadings = TABLEBODY?.map((items, index) => {
      const {data}=items;
      const temp=data?.filter(x=>x.value>0);
      let  newsubtext;
      if(temp.length>0)
      {
        newsubtext='['+temp.length+' selected]';       
      }
    else{
        newsubtext=`[0 selected]`
        }
     return {
          url: `#section${index}`,
          text: items.category,
          subtext: newsubtext,
          className : 'rfp-service-capabilities'
        };
     });

    } else {
      TABLEBODY = Level1DesignationStorage;
    }

    /**
     *@UNIQUE_HEADINGS
     */

    const UNIQUE_DESIGNATION_HEADINGS = [...new Set(CAPACITY_CONCAT_Heading?.map(item => item.name))];

    const UNIQUE_DESIGNATION_HEADINGS_ARR = UNIQUE_DESIGNATION_HEADINGS?.map(designation => {
      const findDesgination = CAPACITY_CONCAT_Heading?.filter(item => item.name == designation)[0];
      return findDesgination;
    });

    

    req.session.serviceCapabilityData = Level1DesignationStorage;
    const TotalAdded = DRequirements?DRequirements.length:0;
   
    TableHeadings.sort((a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0)
    if(TABLEBODY.length>0)
    {
      for(let i=0;i<TABLEBODY.length;i++)
      {
        TABLEBODY[i].data.sort((a, b) => a.groupname< b.groupname? -1 : a.groupname> b.groupname? 1 : 0)
      }
    }
    TABLEBODY.sort((a, b) => a.category< b.category? -1 : a.category> b.category? 1 : 0)

    let finalResult=[];
    TABLEBODY?.forEach((item:any)=>{
        var data={
            parent:item.category,
            subParent:[]//{sp:'',items:[]}
        };
        item.data?.forEach((dta:any) => {
            if(dta.value!='')
            {
                data.subParent.push(dta.groupname)
            }
        });
        finalResult.push(data);
    });
    return finalResult?.filter(a=>a.subParent.length!=0);
    };
