import * as express from 'express';
import * as cmsData from '../../../resources/content/requirements/da-reviewsupplier.json';
//import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
// import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';
import {CalRankSuppliers} from '../../shared/CalRankSuppliers';


//@GET /rfi/event-sent
export const GET_DA_REVIEW_SUPPLIER  = async (req: express.Request, res: express.Response) => {

    const { agreementLotName, agreementName, agreement_id, releatedContent, project_name,projectId,eventId } =
    req.session;
    const lotid = req.session?.lotId;
    const agreementId_session = agreement_id;
    const { isJaggaerError } = req.session;
    req.session['isJaggaerError'] = false;
    const { SESSION_ID } = req.cookies; //jwt

    //api
    // const url = `/tenders/projects/${projectId}/events/${eventId}`;
    // const fetch_dynamic_api = await TenderApi.Instance(SESSION_ID).get(url);
    // const fetch_dynamic_api_data = fetch_dynamic_api?.data;
    //api

    let RankedSuppliers = [];const result= await CalRankSuppliers(req);

    RankedSuppliers=result;

    let SUPPLIER_DATA=[
      {
        "name": "SAPPHIRE ENERGY RECOVERY LIMITED",
        "id": "US-DUNS-220250828"
      }
    ]

    //dummy data

    let supplier_company_name="Supplier company name";
    let supplier_trading_name="Supplier trading name";
    let capacity_score="XX%";
    let vetting_score="XX%";
    let capability_score="XX%";
    let scalability_score="XX%";
    let location_score="XX%";

    for (var i=0;i<SUPPLIER_DATA.length;i++)
      {
    let data=RankedSuppliers.filter(s=>s.supplier.id==SUPPLIER_DATA[i].id);
    if(data.length>0)
    {
      supplier_company_name=data[0].name;
      supplier_trading_name=data[0].name; 
      capacity_score=data[0].dimensionScores.filter((d:any)=>d.name=="Capacity")?.[0].score;
      vetting_score=data[0].dimensionScores.filter((d:any)=>d.name=="Resource Quantity")?.[0].score;
      capability_score=data[0].dimensionScores.filter((d:any)=>d.name=="Capability")?.[0].score;
      scalability_score=data[0].dimensionScores.filter((d:any)=>d.name=="Scalability")?.[0].score;
      location_score=data[0].dimensionScores.filter((d:any)=>d.name=="Location")?.[0].score;
    }
      }
    //dummy data

    const appendData = {
          data: cmsData,
          releatedContent,
          //fetch_dynamic_api_data,
          supplier_company_name,
          supplier_trading_name,
          capacity_score,
          vetting_score,
          capability_score,
          scalability_score,
          location_score,
          projectId,
          eventId
    }
    

    res.locals.agreement_header = {
        agreementName,
        project_name,
        agreementId_session,
        agreementLotName,
        lotid,
        error: isJaggaerError,
      };

try {
    res.render('da-reviewsupplier.njk', appendData)
  }catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFI Publish Page',
      true,
    );
  }

}


export const POST_DA_REVIEW_SUPPLIER = async (req: express.Request, res: express.Response) => {
    
  };
  





