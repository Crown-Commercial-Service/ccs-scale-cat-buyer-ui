//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as CMSData from '../../../resources/content/requirements/ca-summary.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { REQUIREMENT_PATHS } from '../model/requirementConstants';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { CalRankSuppliers } from '../../shared/CalRankSuppliers';
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
      eventId,
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
        let Weightings=[];
        let isSubContractorAccepted = '';
        let wholeCluster=[];
        let individualcluster=[];
        let Securityoption='';
        let Securityresources=0;
        let Teamscale='';
        let wherewrkdone=[];
        let SuppliersForward='';
        let individualGroupcluster=[];
        let Totalresourcesvetting=0;
        if(dimensionRequirements.length>0)
        {
         //Enter your weightings
        
        for(let i=1;i<=5;i++)
        {
            let dim=dimensionRequirements.filter(x=>x["dimension-id"] === i)
            Weightings.push(...dim)
        }

        //Sub-contractor
        
        let subcontractorscheck;
        if(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2).length>0)
        {
          subcontractorscheck=(dimensionRequirements?.filter(dimension => dimension["dimension-id"] === 2)[0].includedCriteria.
          find(x=>x["criterion-id"]==1))
        }
        isSubContractorAccepted = subcontractorscheck!=undefined?'yes':'no'
        let totalQuantityca=0;
        //Resourve Vetting and Weighting
        //todo
        if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 7).length>0)
        {
          if(dimensionRequirements.filter(dimension => dimension["dimension-id"] === 7)[0].requirements.length>0)
          {
            totalQuantityca=dimensionRequirements.filter(x=>x["dimension-id"]===7)[0].requirements.map(a => a.weighting).reduce(function(a, b)
            {
               return a + b;
            });
            Totalresourcesvetting=totalQuantityca;
          }      
      }

        //Choose highest security
        if(dimensionRequirements.filter(dimension =>dimension["dimension-id"] ===2).length>0)
        {
          if(dimensionRequirements.filter(dimension =>dimension["dimension-id"] ===2)[0].requirements.length>0)
          {
            Securityoption = dimensionRequirements.filter(dimension => dimension["dimension-id"] ===2)[0]
        .requirements[0].values?.find(y=>y["criterion-id"]==0)?.value;      
        let securityQuantity=dimensionRequirements.filter(dimension => dimension["dimension-id"] ===2)[0]
        .requirements[0].values?.find(y=>y["criterion-id"]==6)?.value
        Securityresources=totalQuantityca-securityQuantity;
       }
      }
      
        //Service Capability
        CAPACITY_DATASET = CAPACITY_DATASET.filter(levels => levels["dimension-id"]==3);

        let CAPACITY_CONCAT_OPTIONS = CAPACITY_DATASET.map(item => {
          const { weightingRange, options } = item;
          return options.map(subItem => {
            return {
              ...subItem,
              weightingRange,
            };
          });
        }).flat();
       
    if(dimensionRequirements.filter(x=>x["dimension-id"]==3)[0]?.requirements.length>0)
    {
        let SerCapdimensions= dimensionRequirements.filter(x=>x["dimension-id"]==3)[0]?.requirements;

        let SerCapRequirements=[];
        SerCapdimensions.forEach(item => {
            SerCapRequirements.push(CAPACITY_CONCAT_OPTIONS.find(x=>x["requirement-id"]==item["requirement-id"]))
        });   
        SerCapdimensions.forEach(item => {
            let index=SerCapRequirements.findIndex(x=>x["requirement-id"]==item["requirement-id"])
            SerCapRequirements[index].InputWeighting=item.weighting;
        });
     
        wholeCluster.push(...SerCapRequirements.filter(x=>x.groupRequirement==true))
        individualGroupcluster.push(...SerCapRequirements.filter(x=>x.groupRequirement==false))

        let distinctgroupnames = [... new Set(individualGroupcluster.map(x=>x.groups[0].name))]
        distinctgroupnames.forEach((item) => {
        let groupname=individualGroupcluster.map(x => { return [item, individualGroupcluster.filter(x => x.groups[0].name == item)] })[0]
        individualcluster.push(groupname)       
        });
    }
       

        //Team Scale
        Teamscale=dimensionRequirements.filter(x=>x["dimension-id"]==4)[0]?.requirements[0].name;

        //Where work done
        wherewrkdone=dimensionRequirements.filter(x=>x["dimension-id"]==5)[0]?.requirements;

        //Suppliers to Forward
        const eventResponse = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${projectId}/events/${eventId}`);
        SuppliersForward=eventResponse?.data.nonOCDS.assessmentSupplierTarget ?? 0

        //Ranked Suppliers
        //todo
        const result= await CalRankSuppliers(req);
        const Supplier_BASEURL=`/tenders/projects/${projectId}/events/${eventId}/suppliers`;
        let { data: SuppliersData } = await TenderApi.Instance(SESSION_ID).get(Supplier_BASEURL);

        }
      


        
        
       
        const windowAppendData = {
            data: CMSData,
            releatedContent,
            choosenViewPath,         
            Weightings:Weightings,
            isSubContractorAccepted:isSubContractorAccepted,
            Securityoption:Securityoption,
            Securityresources:Securityresources,
            wholeCluster:wholeCluster,
            individualcluster:individualcluster,
            Teamscale:Teamscale,
            wherewrkdone:wherewrkdone,
            SuppliersForward:SuppliersForward,
            Totalresourcesvetting:Totalresourcesvetting
        }
     //  res.json(CAPACITY_DATASET)
    res.render('ca-summary.njk', windowAppendData);
        
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