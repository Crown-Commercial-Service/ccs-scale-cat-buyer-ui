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
// import { Blob } from 'buffer';
// import { JSDOM } from 'jsdom';
// import { Parser } from 'json2csv';
import { CalRankSuppliers } from '../../shared/CalRankSuppliers';
import {CAGetRequirementDetails} from '../../shared/CAGetRequirementDetails';
const excelJS= require('exceljs');
import SampleData from '../../shared/SampleData.json';

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
      
      const  assessmentId = currentEvent.assessmentId;//507 
      const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
      const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
      const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;//scores data
      let dimensionRequirements = ALL_ASSESSTMENTS_DATA.dimensionRequirements;//SampleData

      const baseURL: any = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
      const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers

      

      let RankedSuppliers = [];const result= await CalRankSuppliers(req);

      RankedSuppliers=result;

      // let supplierList = [];
      // supplierList = await GetLotSuppliers(req);//data of all suppliers

      let finalCSVData=[];
      let dataPrepared:any;
      for (var i=0;i<SUPPLIER_DATA.suppliers.length;i++)
      {
        let data=RankedSuppliers.filter(s=>s.supplier.id==SUPPLIER_DATA.suppliers[i].id);
        
        if(data.length>0){
          
          dataPrepared ={
            "Rank No.":data[0]?.rank,
            "Supplier Name":data[0]?.name,
            "Supplier Trading Name":data[0]?.name,
            "Total Score":data[0]?.total,
            "Capacity Score":data[0].dimensionScores.filter(d=>d["dimension-id"]==1)?.[0]?.score,
            "Security Clearance Score":data[0].dimensionScores.filter(d=>d["dimension-id"]==2)?.[0]?.score,
            "Capability Score":data[0].dimensionScores.filter(d=>d["dimension-id"]==3)?.[0]?.score,
            "Scalability Score":data[0].dimensionScores.filter(d=>d["dimension-id"]==4)?.[0]?.score,
            "Location Score":data[0].dimensionScores.filter(d=>d["dimension-id"]==5)?.[0]?.score
          }
          finalCSVData.push(dataPrepared);
        }
      }
      finalCSVData.sort((a, b) => a["Rank No."] < b["Rank No."]? -1 : a["Rank No."]> b["Rank No."]? 1 : 0);
      let dimensionsTable=[];
      for (var i=1;i<=5;i++)
      {   
        let dim=dimensionRequirements.filter(item=>item["dimension-id"]==i)[0]
        if(dim!=undefined){
        dataPrepared={
          "Dimension":dim.name,
          "Weighting":dim.weighting
        }
        dimensionsTable.push(dataPrepared);
      }
      }
      
      let requirementsTable=await CAGetRequirementDetails(req);
      

    //   let supplierFields = ["Rank No.","Supplier Name","Supplier Trading Name","Total Score","Capacity Score","Security Clearance Score"
    // ,"Capability Score","Scalability Score","Location Score"];
    //   let json2csv = new Parser({supplierFields});
    //   let csv = json2csv.parse(finalCSVData);

    //   csv=csv+"\n\n\"Overall Dimension Weightings\"\r\n";
    //   let dimensionFields=["Dimension","Weighting"];
    //   json2csv=new Parser({dimensionFields});
    //   csv=csv+json2csv.parse(dimensionsTable);

    //   csv=csv+"\n\n\"Requirements & Weightings\"\r\n";
    //   csv=csv+"Dimension is the group of the requirements that comprises of an overall dimension weighting.\r\n";
    //   csv=csv+"Requirement group is the group of the requirements selected by the buyer in each dimension i.e. \"Service Capability - Performance analysis and data\" ; \"Role Family - Data\"\r\n";
    //   csv=csv+"Requirement is the buyer selected input in each dimension i.e \"Service Capability - A/B and multivariate testing\"; \"Role Family - Data Analyst SFIA Level\"\r\n";
    //   let requirementsFields=["Dimension","Requirement Group","Requirement","Quantity","Relative Weighting"];
    //   json2csv=new Parser({requirementsFields});
    //   csv=csv+json2csv.parse(requirementsTable); 

    //   res.header('Content-Type', 'text/csv');
    //   res.attachment("Suppliers_List.csv");         
    //   res.send(csv);

    const workbook = new excelJS.Workbook();
    let worksheet = workbook.addWorksheet("Scores"); // New Worksheet
    worksheet.columns = [
      { header: "Rank No.", key: "Rank No.", width: 10 }, 
      { header: "Supplier Name", key: "Supplier Name", width: 10 },
      { header: "Supplier Trading Name", key: "Supplier Trading Name", width: 10 },
      { header: "Total Score", key: "Total Score", width: 10 },
      { header: "Capacity Score", key: "Capacity Score", width: 10 },
      { header: "Security Clearance Score", key: "Security Clearance Score", width: 10 },
      { header: "Capability Score", key: "Capability Score", width: 10 },
      { header: "Scalability Score", key: "Scalability Score", width: 10 },
      { header: "Location Score", key: "Location Score", width: 10 },
  ];
  finalCSVData.forEach(data=>{
    worksheet.addRow(data);
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  worksheet = workbook.addWorksheet("Dimension Weightings"); // New Worksheet
  worksheet.getRow(1).values=["Overall Dimension Weightings"];
  worksheet.getRow(2).values=[""];
  worksheet.getRow(3).values=["Dimension","Weighting"]
    worksheet.columns = [
      {  key: "Dimension", width: 10 }, 
      {  key: "Weighting", width: 10 },
  ];
  dimensionsTable.forEach(data=>{
    worksheet.addRow(data);
  });
  worksheet.getRow(3).eachCell((cell) => {
    cell.font = { bold: true };
  });
  worksheet = workbook.addWorksheet("Requirements"); // New Worksheet
  worksheet.getRow(1).values=["Requirements & Weightings"];
  worksheet.getRow(2).values=[""];
  worksheet.getRow(3).values=["Dimesnion is the group of the requirements that comprises of an overall dimension weighting"];
  worksheet.getRow(4).values=["Requirement Group is the group of the requirements selected by the buyer in each dimension i.e. \"Service Capability - Performance analysis and data\"; \"Role Family - Data\""];
  worksheet.getRow(5).values=["Requirement is the buyer selected input in each dimension i.e. \"Service Capability - A/B and multivariate testing\", \"Role Family - Data Analyst SFIA Level\""];
  worksheet.getRow(6).values=[""];
  worksheet.getRow(7).values=["Dimension","Requirement Group","Requirement","Quantity","Relative Weighting"];
  worksheet.columns = [
      {  key: "Dimension", width: 10 }, 
      {  key: "Requirement Group", width: 10 },
      {  key: "Requirement", width: 10 },
      { key: "Quantity", width: 10 },
      { key: "Relative Weighting", width: 10 },
  ];
  requirementsTable.forEach(data=>{
    worksheet.addRow(data);
  });
  worksheet.getRow(7).eachCell((cell) => {
    cell.font = { bold: true };
  });
  const data = await workbook.xlsx.writeFile(`suppliers.xlsx`).then(() => {
    res.sendFile(`suppliers.xlsx`, { root: '.' });
  });
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
