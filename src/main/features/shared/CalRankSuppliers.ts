//@ts-nocheck
import express from 'express';
import SampleData from './SampleData.json';
import { GetLotSuppliers } from './supplierService';
import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../common/logtracer/tracer';

export const CalRankSuppliers = async (req: express.Request) => {
    const { currentEvent } = req.session;
    const { assessmentId } = currentEvent;
    const { SESSION_ID } = req.cookies; //jwt
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;
    let { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
    let assesssort = assessments.scores.sort((a, b) => (a.total > b.total ? -1 : 1));
    const distinctassessments = [... new Set(assesssort.map(x => x.total))]
    let RankedSuppliers = [];
    let supplierList = [];

    //GET TOTAL SUPPLIERS LIST
  supplierList = await GetLotSuppliers(req);
  
  //ASSIGN RANKS TO SUPPLIERS WHEN SOCRES ARE DISTINCT
  if (distinctassessments.length === assesssort.length) {   
      assesssort.forEach((score, index) => {
        score.rank = index + 1;
        score.name = supplierList.find(s => s.organization.id === score.supplier.id).organization.name
      });
      RankedSuppliers = [...assesssort];       
    }
  else {
    //IF ANY OF THE SUPPLIERS HAS SIMILAR RANKS
    let similarrank;
    let rankValue = 0;
    for (let i = 0; i < assesssort.length; i++) {
      let similarRankedItems = assesssort.filter(x => x.total == assesssort[i].total);
      if (similarRankedItems.length == 1) {       
        assesssort[i].rank = ++rankValue;
        assesssort[i].name = supplierList.find(s => s.organization.id === assesssort[i].supplier.id).organization.name;
        RankedSuppliers.push(assesssort[i]);
      }
      else {
        //SORT WITH CAPACITY
        similarrank=++rankValue;
        let firstIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores.find(x => x["dimension-id"] == 1)] });
        let firstIterateSort: any = firstIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
        const firstIterateDistint = [... new Set(firstIterateSort.map(x => x[1].score))];
        if (firstIterateDistint.length == firstIterateSort.length) {
          firstIterateSort.forEach(x => {
            let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
            assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
            assesssort[indexVal].rank = similarrank;
            RankedSuppliers.push(assesssort[indexVal]);
          });
        } 
        else {
          //SORT WITH VETTING
          let secondIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores.find(x => x["dimension-id"] == 2)] });
          let secondIterateSort: any = secondIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
          const secondIterateDistint = [... new Set(secondIterateSort.map(x => x[1].score))];
          if (secondIterateDistint.length == secondIterateSort.length) {
            secondIterateSort.forEach(x => {
              let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
              assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
              assesssort[indexVal].rank = similarrank;
              RankedSuppliers.push(assesssort[indexVal]);
            });
          }
          else {
            //SORT WITH CAPABILITY
            let thirdIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores.find(x => x["dimension-id"] == 3)] });
            let thirdIterateSort: any = thirdIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
            const thirdIterateDistint = [... new Set(thirdIterateSort.map(x => x[1].score))];
            if (thirdIterateDistint.length == thirdIterateSort.length) {
              thirdIterateSort.forEach(x => {
                let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                RankedSuppliers.push(assesssort[indexVal]);
              });
            }
            else {
              //SORT WITH SCALABILITY
              let fourthIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores.find(x => x["dimension-id"] == 4)] });
              let fourthIterateSort: any = fourthIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
              const fourthIterateDistint = [... new Set(fourthIterateSort.map(x => x[1].score))];
              if (fourthIterateDistint.length == fourthIterateSort.length) {
                fourthIterateSort.forEach(x => {
                  let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                  assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                  RankedSuppliers.push(assesssort[indexVal]);
                });
              }
              else {
                //SORT WITH LOCATION
                let fifthIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores.find(x => x["dimension-id"] == 5)] });
                let fifthIterateSort: any = fifthIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
                const fifthIterateDistint = [... new Set(fifthIterateSort.map(x => x[1].score))];
                if (fifthIterateDistint.length == fifthIterateSort.length) {
                  fifthIterateSort.forEach(x => {
                    let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                    assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                    RankedSuppliers.push(assesssort[indexVal]);
                  });
                }
                else {
                  //SORT WITH ALPHABETICAL ORDER
                  let sortbyalpha=[];
                  similarRankedItems.forEach(x => {
                    let indexVal = assesssort.findIndex(sup => sup.supplier.id == x.supplier.id);
                    assesssort[indexVal].rank = similarrank;
                    assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    sortbyalpha.push(assesssort[indexVal]);
                    
                  });
                  sortbyalpha.sort((a, b) => a.name < b.name ? -1 : a.name> b.name ? 1 : 0);
                  RankedSuppliers.push(...sortbyalpha);
                }
              }
            }
          }
        }
      }
      i += similarRankedItems.length - 1;
    }
  }
  for(let i=0;i<RankedSuppliers.length;i++)
  {
    RankedSuppliers[i].dimensionScores.sort((a, b) => a["dimension-id"] < b["dimension-id"]? -1 : a["dimension-id"]> b["dimension-id"]? 1 : 0);
  } 
  const SupplierswithRanks=RankedSuppliers;
  return SupplierswithRanks;
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
