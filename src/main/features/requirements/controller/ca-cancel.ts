//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/caCancel.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
// import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
import { CalRankSuppliers } from '../../shared/CalRankSuppliers';

// FC cancel
export const CA_GET_CANCEL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId } = req.session;
  const releatedContent = req.session.releatedContent;
  const { currentEvent ,eventId} = req.session;
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ':' + lotid + '/lot-suppliers';
  const {download}=req.query;
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/38`, 'In progress');
    
    
    const appendData = {
      data: cmsData,
      releatedContent: releatedContent,
    };
    if(download!=undefined){
      const  assessmentId = 507;//currentEvent.assessmentId;
      const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
      const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
      const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;//scores data

      const baseURL: any = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
      const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers

      //dummy data start
      SUPPLIER_DATA=[
        {
          "name": "SAPPHIRE COOLING SERVICES LIMITED",
          "id": "US-DUNS-235375081"
        }
      ]
      //dummy data end

      let RankedSuppliers = [];const result= await CalRankSuppliers(req);

      RankedSuppliers=result;

      // let supplierList = [];
      // supplierList = await GetLotSuppliers(req);//data of all suppliers

      let finalCSVData=[];
      let dataPrepared:any;
      for (var i=0;i<SUPPLIER_DATA.length;i++)
      {
        let data=RankedSuppliers.filter(s=>s.supplier.id==SUPPLIER_DATA[i].id);
        
        if(data.length>0){
          
          dataPrepared ={
            "Rank No.":data[0].rank,
            "Supplier Name":data[0].name,
            "Supplier Trading Name":data[0].name,
            "Total Score":data[0].total,
            "Capacity Score":data[0].dimensionScores.filter(d=>d.name=="Capacity")?.[0].score,
            "Security Clearance Score":data[0].dimensionScores.filter(d=>d.name=="Resource Quantity")?.[0].score,
            "Capability Score":data[0].dimensionScores.filter(d=>d.name=="Capability")?.[0].score,
            "Scalability Score":data[0].dimensionScores.filter(d=>d.name=="Scalability")?.[0].score,
            "Location Score":data[0].dimensionScores.filter(d=>d.name=="Location")?.[0].score
          }
          finalCSVData.push(dataPrepared);
        }
      }
      
      let dimensionsTable=[];
      dataPrepared={
        "Dimension":"200",
        "Weighting":"200"
      }
      dimensionsTable.push(dataPrepared);

      let requirementsTable=[];
      dataPrepared={
        "Dimension":"200",
        "Requirement Group":"200",
        "Requirement":"200",
        "Quantity":"200",
        "Relative Weighting":"200"
      }
      requirementsTable.push(dataPrepared);

      let supplierFields = ["Rank No.","Supplier Name","Supplier Trading Name","Total Score","Capacity Score","Security Clearance Score"
    ,"Capability Score","Scalability Score","Location Score"];
      let json2csv = new Parser({supplierFields});
      let csv = json2csv.parse(finalCSVData);

      csv=csv+"\n\n\"Overall Dimension Weightings\"\r\n";
      let dimensionFields=["Dimension","Weighting"];
      json2csv=new Parser({dimensionFields});
      csv=csv+json2csv.parse(dimensionsTable);

      csv=csv+"\n\n\"Requirements & Weightings\"\r\n";
      csv=csv+"Dimension is the group of the requirements that comprises of an overall dimension weighting.\r\n";
      csv=csv+"Requirement group is the group of the requirements selected by the buyer in each dimension i.e. \"Service Capability - Performance analysis and data\" ; \"Role Family - Data\"\r\n";
      csv=csv+"Requirement is the buyer selected input in each dimension i.e \"Service Capability - A/B and multivariate testing\"; \"Role Family - Data Analyst SFIA Level\"\r\n";
      let requirementsFields=["Dimension","Requirement Group","Requirement","Quantity","Relative Weighting"];
      json2csv=new Parser({requirementsFields});
      csv=csv+json2csv.parse(requirementsTable); 

      res.header('Content-Type', 'text/csv');
      res.attachment("Suppliers_List.csv");         
      res.send(csv);
    }
    else{
    res.render('ca-cancel', appendData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - CapAss',
      true,
    );
  }
};
