//@ts-nocheck
import * as express from 'express';
import * as dataRRS from '../../../resources/content/requirements/caReviewRankedSuppliers.json';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import SampleData from '../../shared/SampleData.json';
import { CalRankSuppliers } from '../../shared/CalRankSuppliers';
import { CAGetRequirementDetails } from '../../shared/CAGetRequirementDetails';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import {CAGetRequirementDetails} from '../../shared/CAGetRequirementDetails';
const excelJS= require('exceljs');

export const CA_GET_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId, releatedContent, isError, errorText, choosenViewPath, eventId, currentEvent } = req.session;
  const { assessmentId } = currentEvent;
  const { data: eventData } = await TenderApi.Instance(SESSION_ID).get(
    `/tenders/projects/${projectId}/events/${eventId}`,
  );
  let lotid = req.session.lotId;
  lotid = lotid.replace('Lot ', '')
  const lotSuppliers =
    config.get('CCS_agreements_url') + req.session.agreement_id + ':' + lotid + '/lot-suppliers';
  const { assessmentSupplierTarget: numSuppliers } = eventData.nonOCDS;
  let dataRRSMod = { ...dataRRS };
  dataRRSMod.p1 = dataRRSMod.p1.replace(new RegExp('X', 'g'), numSuppliers);
  const { download } = req.query;
  try {
    let RankedSuppliers = [];
    let TopRankScores = [];
    let supplierList = [];
    let LeastRankScores = [];

    const result = await CalRankSuppliers(req);
    const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    let { data: SuppliersData } = await TenderApi.Instance(SESSION_ID).get(Supplier_BASEURL);
    let Justification = null;
    RankedSuppliers = result;
    let BelowRankScores = [];
    if (numSuppliers > RankedSuppliers.length) {
      TopRankScores = RankedSuppliers;
    }
    else {
      TopRankScores = [...RankedSuppliers.slice(0, numSuppliers)]
      LeastRankScores = [...RankedSuppliers.slice(numSuppliers)]
      if (LeastRankScores.length > 0) {
        if (TopRankScores[TopRankScores.length - 1].rank === LeastRankScores[0].rank) {
          const Leastscorerank = LeastRankScores[0].rank;
          BelowRankScores = LeastRankScores.filter(x => x.rank === Leastscorerank).concat(TopRankScores.filter(x => x.rank === Leastscorerank))
          if (SuppliersData.suppliers.length > 0) {
            SuppliersData.suppliers.forEach(element => {
              let selectedLocIndex = BelowRankScores.findIndex(x => x.supplier.id === element.id);
              if (selectedLocIndex != -1) {
                BelowRankScores[selectedLocIndex].checked = true;
              }

              Justification = SuppliersData.justification;
            });
            BelowRankScores.sort((a, b) => a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : 0);
          }

          BelowRankScores.filter(x => x.dimensionScores.map(y => y.score = parseFloat(y.score).toFixed(2)))
          TopRankScores = [...TopRankScores.slice(0, -TopRankScores.filter(x => x.rank === Leastscorerank).length)]
          dataRRSMod.p2 = dataRRSMod.p2.replace(new RegExp('Z', 'g'), BelowRankScores.length);
          dataRRSMod.p2 = dataRRSMod.p2.replace(new RegExp('X', 'g'), numSuppliers - TopRankScores.length);
        }
      }
    }

    TopRankScores.filter(x => x.dimensionScores.map(y => y.score = parseFloat(y.score).toFixed(2)))
    let lastrankinTop = TopRankScores.slice(-1)
    dataRRSMod.p5 = dataRRSMod.p5.replace(new RegExp('X', 'g'), TopRankScores.length);
    dataRRSMod.p5 = dataRRSMod.p5.replace(new RegExp('Z', 'g'), lastrankinTop[0].rank);

    req.session.isError = false;
    req.session.errorText = '';
    req.session.TopRankScores = TopRankScores;
    req.session.BelowRankScores = BelowRankScores;

    if (download != undefined) {
      const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
      let { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
      let finalCSVData = [];
      let dataPrepared: any;
      //sheet 1
      let downloadedRankedSuppliers = req.session.TopRankScores.concat(req.session.BelowRankScores)
      for (var i = 0; i < downloadedRankedSuppliers.length; i++) {
        dataPrepared = {
          "Rank No.": downloadedRankedSuppliers[i].rank,
          "Supplier Name": downloadedRankedSuppliers[i].name,
          "Supplier Trading Name": downloadedRankedSuppliers[i].name,
          "Total Score": downloadedRankedSuppliers[i].total,
          "Capacity Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 1).score,
          "Security Clearance Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 2).score,
          "Capability Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 3).score,
          "Scalability Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 4).score,
          "Location Score": downloadedRankedSuppliers[i].dimensionScores.find(x => x["dimension-id"] == 5).score
        }
        finalCSVData.push(dataPrepared);
      }
      //sheet 2
      let dimensionsTable = [];
      let dimensions = [];
      let { dimensionRequirements } = assessments;
      for (let i = 1; i <= 5; i++) {
        dataPrepared = {
          "Dimension": dimensionRequirements[i].name,
          "Weighting": dimensionRequirements[i].weighting,
        }
        dimensionsTable.push(dataPrepared);
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
    else {
      const appendData = { ...dataRRSMod, choosenViewPath, numSuppliers, RankedSuppliers: TopRankScores, BelowRankScores: BelowRankScores, lotSuppliers: lotSuppliers, Justification: Justification, releatedContent, isError, errorText };

      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'In progress');
      res.render('ca-reviewRankedSuppliers', appendData);
    }

  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - CA TaskList Page',
      true,
    );
  }
};

function checkErrors(ranks, justification) {
  let isError = false;
  let errorText = [];
  const ranksLength = ranks ? ranks.length : 0
  if (ranksLength == 0) {
    isError = true;
    errorText.push({
      text: 'Please select the suppliers',
    });
  }
  else if (ranks.length > 0 && !justification) {
    isError = true;
    errorText.push({
      text: 'A justification must be provided whether or not a supplier from this tie rank is selected to take forward or not',
    });
  }

  return { isError, errorText };
}

export const CA_POST_REVIEW_RANKED_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, releatedContent, eventId } = req.session;
  const { supplierID: belowrankedSuppliers, justification } = req['body'];
  let SelectedbelowrankedSuppliers = [];

  try {
    let TopRankScores = [];
    let BelowRankScores = [];
    let overallsuppliers = [];
    let leastranksuppliers = [];
    TopRankScores = req.session.TopRankScores;
    BelowRankScores = req.session.BelowRankScores;
    if (belowrankedSuppliers != undefined && justification != undefined) {
      if (Array.isArray(belowrankedSuppliers)) {
        SelectedbelowrankedSuppliers.push(...belowrankedSuppliers);
      }
      else {
        SelectedbelowrankedSuppliers.push(belowrankedSuppliers);
      }

      SelectedbelowrankedSuppliers.forEach(element => {
        let temp = BelowRankScores.find(x => x.supplier.id === element)
        leastranksuppliers.push(temp)
      });

      overallsuppliers = TopRankScores.map(x => { return [x.supplier.id, x.name] }).
        concat(leastranksuppliers.map(x => { return [x.supplier.id, x.name] }))
    }
    else {
      overallsuppliers = TopRankScores.map(x => { return [x.supplier.id, x.name] })
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
      "justification": justification
    };

    const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;

    const response = await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, body);
    if (response.status == 200) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/54`, 'Completed');
      await TenderApi.Instance(SESSION_ID).put(`journeys/${projectId}/steps/55`, 'Not started');
      res.redirect('/ca/next-steps');
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
      'Tender agreement failed to be added',
      true,
    );
  }
};
