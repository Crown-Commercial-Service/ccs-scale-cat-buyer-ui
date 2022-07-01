//@ts-nocheck
import * as express from 'express';
import * as dataRRS from '../../../resources/content/requirements/daReviewRankedSuppliers.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import SampleData from '../../shared/SampleData.json';
import { RankSuppliersforDA } from '../../shared/RankSuppliersforDA';
import { CAGetRequirementDetails } from '../../shared/CAGetRequirementDetails';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
const excelJS= require('exceljs');

export const DA_GET_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, choosenViewPath, eventId, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  const rowCount=10;let showPrevious=false,showNext=false;
  let lotid = req.session.lotId;
  lotid = lotid.replace('Lot ', '')
  const lotSuppliers =
    config.get('CCS_agreements_url') + req.session.agreement_id + ':' + lotid + '/lot-suppliers';
  const { download,downloadPricing,previous,next } = req.query;
  try {
    let RankedSuppliers = [];
    let supplierList = [];
    const result = await RankSuppliersforDA(req);
    const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    let { data: SuppliersData } = await TenderApi.Instance(SESSION_ID).get(Supplier_BASEURL);
    let Justification = [];
    RankedSuppliers = result;
   if (SuppliersData.suppliers.length>0)
   {
    for(let i=0;i<RankedSuppliers.length;i++)
    {
      RankedSuppliers[i].justification='';
    }
    SuppliersData.suppliers.forEach(element => {
    let supplierindex=RankedSuppliers.findIndex(x=>x.supplier.id==element.id)
    if(supplierindex>0)
    {
      RankedSuppliers[supplierindex].checked=true
      RankedSuppliers[supplierindex].justification=SuppliersData.justification
    }
  });
}
    RankedSuppliers.filter(x => x.dimensionScores.map(y => y.score = parseFloat(y.score).toFixed(2)))
    req.session.isError = false;
    req.session.errorText = '';
    req.session.DARankedSuppliers=RankedSuppliers;
    let appendData = {
      dataRRS,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      showPrevious,
      showNext,
      isError, errorText
    };
    //DOWNLOAD SUPPLIER'S LIST
    if (download != undefined) {
      const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
      let { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
      let finalCSVData = [];
      let dataPrepared: any;
      //sheet 1
       let downloadedRankedSuppliers= req.session.DARankedSuppliers
      for (var i = 0; i < downloadedRankedSuppliers.length; i++) {
        dataPrepared = {
          "Rank No.": downloadedRankedSuppliers[i]?.rank,
          "Supplier Name": downloadedRankedSuppliers[i]?.name,
          "Supplier Trading Name": downloadedRankedSuppliers[i]?.name,
          "Total Score": downloadedRankedSuppliers[i]?.total,
          "Capacity Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 1)?.score,
          "Security Clearance Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 2)?.score,
          "Capability Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 3)?.score,
          "Scalability Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 4)?.score,
          "Location Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 5)?.score,
          "Price Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 6)?.score
        }
        finalCSVData.push(dataPrepared);
      }
       
      //sheet 2
      let dimensionsTable = [];
      let { dimensionRequirements } = assessments;
      for (var i=1;i<=6;i++)
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

      //sheet 3
      let requirementsTable = await CAGetRequirementDetails(req);
      const workbook = new excelJS.Workbook();
      let worksheet = workbook.addWorksheet("Scores"); // New Worksheet
      worksheet.columns = [
        { header: "Rank No.", key: "Rank No.", width: 15 },
        { header: "Supplier Name", key: "Supplier Name", width: 15 },
        { header: "Supplier Trading Name", key: "Supplier Trading Name", width: 15 },
        { header: "Total Score", key: "Total Score", width: 15 },
        { header: "Capacity Score", key: "Capacity Score", width: 15 },
        { header: "Security Clearance Score", key: "Security Clearance Score", width: 15 },
        { header: "Capability Score", key: "Capability Score", width: 15 },
        { header: "Scalability Score", key: "Scalability Score", width: 15 },
        { header: "Location Score", key: "Location Score", width: 15 },
        { header: "Price Score", key: "Price Score", width: 15 },
      ];
      finalCSVData.forEach(data => {
        worksheet.addRow(data);
      });
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      worksheet = workbook.addWorksheet("Dimension Weightings"); // New Worksheet
      worksheet.getRow(1).values = ["Overall Dimension Weightings"];
      worksheet.getRow(2).values = [""];
      worksheet.getRow(3).values = ["Dimension", "Weighting"]
      worksheet.columns = [
        { key: "Dimension", width: 15 },
        { key: "Weighting", width: 15 },
      ];
      dimensionsTable.forEach(data => {
        worksheet.addRow(data);
      });
      worksheet.getRow(3).eachCell((cell) => {
        cell.font = { bold: true };
      });
      worksheet = workbook.addWorksheet("Requirements"); // New Worksheet
      worksheet.getRow(1).values = ["Requirements & Weightings"];
      worksheet.getRow(2).values = [""];
      worksheet.getRow(3).values = ["Dimesnion is the group of the requirements that comprises of an overall dimension weighting"];
      worksheet.getRow(4).values = ["Requirement Group is the group of the requirements selected by the buyer in each dimension i.e. \"Service Capability - Performance analysis and data\"; \"Role Family - Data\""];
      worksheet.getRow(5).values = ["Requirement is the buyer selected input in each dimension i.e. \"Service Capability - A/B and multivariate testing\", \"Role Family - Data Analyst SFIA Level\""];
      worksheet.getRow(6).values = [""];
      worksheet.getRow(7).values = ["Dimension", "Requirement Group", "Requirement", "Quantity", "Relative Weighting"];
      worksheet.columns = [
        { key: "Dimension", width: 15 },
        { key: "Requirement Group", width: 15 },
        { key: "Requirement", width: 15 },
        { key: "Quantity", width: 15 },
        { key: "Relative Weighting", width: 15 },
      ];
      requirementsTable.forEach(data => {
        worksheet.addRow(data);
      });
      worksheet.getRow(7).eachCell((cell) => {
        cell.font = { bold: true };
      });
      const data = await workbook.xlsx.writeFile(`suppliers.xlsx`).then(() => {
        res.sendFile(`suppliers.xlsx`, { root: '.' });
      });
    }
    //DOWNLOAD PRICING INFORMATION
    else if(downloadPricing!=undefined)
    {
      const pricing_BASEURL = `/assessments/tools/2/dimensions/6/data?suppliers=`+downloadPricing;
      let { data: SuppliersPricingData } = await TenderApi.Instance(SESSION_ID).get(pricing_BASEURL);     
      res.header('Content-Type', 'text/csv');
      res.attachment("Suppliers_List.csv");         
      res.send(SuppliersPricingData);
    }
    else{
      //PAGINATION
      let noOfPages=Math.ceil(RankedSuppliers.length/rowCount);
      if(previous==undefined && next==undefined)
      {
        req.session.DASupplierpagenumber=1;
        if(RankedSuppliers.length<=rowCount)
        {
          showPrevious=false;
          showNext=false;
          appendData = {
            dataRRS,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      showPrevious,
      showNext,
      isError, errorText
          };
        }
        else
        {
          showPrevious=false;
          showNext=true;
          
          RankedSuppliers=RankedSuppliers.slice(0,rowCount);
          appendData = {
            dataRRS,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      showPrevious,
      showNext,
      isError, errorText,
            currentpagenumber:1,
            noOfPages,
          };
        }
      }
      else
      {
        if(previous!=undefined)
        {
            let currentpagenumber=req.session.DASupplierpagenumber;
            let previouspagenumber=currentpagenumber-1;
            let lastindex=previouspagenumber*rowCount;
            RankedSuppliers=RankedSuppliers.slice(lastindex-rowCount,lastindex);
            req.session.DASupplierpagenumber=previouspagenumber;
            if(previouspagenumber==1)
            {
              showPrevious=false;
            }
            else
            {
              showPrevious=true;
            }
            showNext=true;
            appendData = {
              dataRRS,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      showPrevious,
      showNext,
      isError, errorText,
              currentpagenumber:previouspagenumber,
              noOfPages,
            };
        }
        else{//next is undefined
          let currentpagenumber=req.session.DASupplierpagenumber;
          let nextpagenumber=currentpagenumber+1;
          let lastindex=nextpagenumber*rowCount;
          let firstindex=0;
          if(lastindex > RankedSuppliers.length)
          {
            lastindex=RankedSuppliers.length;
            firstindex=currentpagenumber*rowCount;
          }
          else
          {
            firstindex=lastindex-rowCount;
          }
          RankedSuppliers=RankedSuppliers.slice(firstindex,lastindex);
          req.session.DASupplierpagenumber=nextpagenumber;
          
          if(nextpagenumber==noOfPages)
          {
            showNext=false;
          }
          else
          {
            showNext=true;
          }
          showPrevious=true;
          appendData = {
            dataRRS,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      showPrevious,
      showNext,
      isError, errorText,
            currentpagenumber:nextpagenumber,
            noOfPages,
          };
        }
      }
      let flag = await ShouldEventStatusBeUpdated(eventId, 71, req);
  if (flag) {
await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/71`, 'In progress');
  }
       res.render('da-reviewRankedSuppliers', appendData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - DA review & ranked suppliers ',
      true,
    );
  }
};

function checkErrors(ranks, justification) {
  let isError = false;
  let errorText = [];

  if (ranks.length > 0 && !justification) {
    isError = true;
    errorText.push({
      text: 'A justification must be provided',
    });
  }

  return { isError, errorText };
}

export const DA_POST_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, eventId } = req.session;
  const { supplierID: supplierID, justification } = req['body'];

  try {
    let overallsuppliers=[];
    let DARankedSuppliers = req.session.DARankedSuppliers;
    let overallJustification ='';

    if (supplierID != undefined && justification != undefined) {
      overallsuppliers = DARankedSuppliers.filter(y=>y.supplier.id==supplierID).map(x => { return [x.supplier.id, x.name] })
      if(Array.isArray(justification))
      {
        justification.forEach(element => {
          if(element!=undefined && element!='')
          {
            overallJustification=element
          }
        });
      }
     else{
       overallJustification=justification
     }
    }

    let supplierdata = overallsuppliers.map(item => {
      const name = item[1];
      const id = item[0];
      return {
        name: name,
        id: id
      }
    });

    const body = {
      "suppliers": supplierdata,
      "justification": overallJustification,
      "overwriteSuppliers": true
    };

    const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;

    const response = await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, body);
    if (response.status == 200) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/71`, 'Completed');
      let flag = await ShouldEventStatusBeUpdated(eventId, 72, req);
      if (flag) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/72`, 'Not started');
      }
      res.redirect('/da/next-steps');
    }
    else {
      res.redirect('/404/');
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA REVIEW RANKED SUPPLIERS',
      true,
    );
  }
};
