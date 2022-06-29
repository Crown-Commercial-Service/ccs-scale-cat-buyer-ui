//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { RankSuppliersforDA } from '../../shared/RankSuppliersforDA';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/requirements/daCancel.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { CAGetRequirementDetails } from '../../shared/CAGetRequirementDetails';
import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
const excelJS= require('exceljs');

// DIRECT AWARD cancel
export const DA_GET_CANCEL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const releatedContent = req.session.releatedContent;
  const { download } = req.query;
  const { currentEvent ,eventId , isError,errorText, choosenViewPath} = req.session;
  const projectId = req.session.projectId;
  const { assessmentId } = currentEvent;
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ':' + lotid + '/lot-suppliers';
  try {
    //await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/38`, 'In progress');
    let RankedSuppliers = [];
    let supplierList = [];
    const result = await RankSuppliersforDA(req);
    const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    let { data: SuppliersData } = await TenderApi.Instance(SESSION_ID).get(Supplier_BASEURL);
    let Justification = [];
    RankedSuppliers = result;
    //supplierList = await GetLotSuppliers(req);
    RankedSuppliers.filter(x => x.dimensionScores.map(y => y.score = parseFloat(y.score).toFixed(2)))
    req.session.isError = false;
    req.session.errorText = '';
    req.session.DARankedSuppliers=RankedSuppliers;
    let appendData = {
      data: cmsData,
      RankedSuppliers: RankedSuppliers,
      choosenViewPath:choosenViewPath,
      lotSuppliers: lotSuppliers,
      releatedContent: releatedContent,
      isError, errorText
    };

   //await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/38`, 'In progress');
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
    else{
      res.render('da-cancel', appendData);
      }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - RFP',
      true,
    );
  }
};

export const DA_POST_CANCEL = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  try {
    res.redirect('/rfp/response-date');
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Suppliers page error - RFP',
      true,
    );
  }
};
