//@ts-nocheck
import express from 'express';
import SampleData from './SampleData.json';
import { GetLotSuppliers } from './supplierService';
import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../common/logtracer/tracer';

export const RankSuppliersforDA = async (req: express.Request) => {
    const { currentEvent } = req.session;
    const { assessmentId } = currentEvent;
    const { SESSION_ID } = req.cookies; //jwt
  try {
    const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}?scores=true`;
    let { data: assessments } = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);
   //let assessments=SampleData;
    let assesssort = assessments.scores.sort((a, b) => (a.total > b.total ? -1 : 1));

    //GET TOTAL SUPPLIERS LIST
    let supplierList = [];
    supplierList = await GetLotSuppliers(req);
    let SupplierswithName=[];
    //IGNORE THE SUPPLIERS WHICH DOESN'T HAVE THE SUPPLIER NAME IN SUPPLIER'S LIST
    SupplierswithName = supplierList.filter(x=>x.organization.name !='' && x.organization.name!=undefined)

    //IGNORE THE SUPPLIERS WHICH DOESN'T MATCH THE SUPPLIER'S LIST
    let DAsuppliers=[];
    SupplierswithName.forEach(item => {
       let suppliersinfo=assesssort.filter(x=>x.supplier.id===item.organization.id)
       DAsuppliers.push(...suppliersinfo)
    });

    //IGNORE THE SUPPLIERS WHO DOESN'T HAVE ALL THE DIMENSION SCORES
    let DASupplierswithAllDimensions=[];
    DASupplierswithAllDimensions=DAsuppliers.filter(x=>x.dimensionScores.length==6)

    assesssort = DASupplierswithAllDimensions.sort((a, b) => (a.total > b.total ? -1 : 1));
    let RankedSuppliers = [];

  const distinctassessments = [... new Set(assesssort.map(x => x.total))]
  //ASSIGN RANKS TO SUPPLIERS WHEN SCORES ARE DISTINCT
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
        //SORT WITH FIRST HIGHEST DIMENSION SCORE
        similarrank=++rankValue;
        for(let i=0;i<similarRankedItems.length;i++)
        {
          similarRankedItems[i].dimensionScores.sort((a, b) => (a.score > b.score ? -1 : 1))
        }
        let firstIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[0]] });
        let firstIterateSort: any = firstIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
        const firstIterateDistint = [... new Set(firstIterateSort.map(x => x[1].score))];
        if (firstIterateDistint.length > 1) {
          firstIterateSort.forEach(x => {
            let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
            assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
            assesssort[indexVal].rank = similarrank;
            RankedSuppliers.push(assesssort[indexVal]);
          });
        } 
        else {
          //SORT WITH SECOND HIGHEST DIMENSION SCORE
          let secondIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[1]] });
          let secondIterateSort: any = secondIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
          const secondIterateDistint = [... new Set(secondIterateSort.map(x => x[1].score))];
          if (secondIterateDistint.length > 1) {
            secondIterateSort.forEach(x => {
              let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
              assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
              assesssort[indexVal].rank = similarrank;
              RankedSuppliers.push(assesssort[indexVal]);
            });
          }
          else {
            //SORT WITH THIRD HIGHEST DIMENSION SCORE
            let thirdIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[2]] });
            let thirdIterateSort: any = thirdIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
            const thirdIterateDistint = [... new Set(thirdIterateSort.map(x => x[1].score))];
            if (thirdIterateDistint.length > 1) {
              thirdIterateSort.forEach(x => {
                let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                RankedSuppliers.push(assesssort[indexVal]);
              });
            }
            else {
              //SORT WITH FOURTH HIGHEST DIMENSION SCORE
              let fourthIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[3]] });
              let fourthIterateSort: any = fourthIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
              const fourthIterateDistint = [... new Set(fourthIterateSort.map(x => x[1].score))];
              if (fourthIterateDistint.length > 1) {
                fourthIterateSort.forEach(x => {
                  let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                  assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                  RankedSuppliers.push(assesssort[indexVal]);
                });
              }
              else {
                //SORT WITH FIFTH HIGHEST DIMENSION SCORE
                let fifthIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[4]] });
                let fifthIterateSort: any = fifthIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
                const fifthIterateDistint = [... new Set(fifthIterateSort.map(x => x[1].score))];
                if (fifthIterateDistint.length > 1) {
                  fifthIterateSort.forEach(x => {
                    let indexVal = assesssort.findIndex(sup => sup.supplier.id == x[0]);
                    assesssort[indexVal].name = supplierList.find(s => s.organization.id === assesssort[indexVal].supplier.id).organization.name;
                    assesssort[indexVal].rank = similarrank;
                    RankedSuppliers.push(assesssort[indexVal]);
                  });
                }
                else {
                    //SORT WITH SIXTH HIGHEST DIMENSION SCORE
                    let sixthIterate = similarRankedItems.map(x => { return [x.supplier.id, x.dimensionScores[1]] });
                    let sixthIterateSort: any = sixthIterate.sort((a, b) => (a[1].score > b[1].score ? -1 : 1));
                    const sixthIterateDistint = [... new Set(sixthIterateSort.map(x => x[1].score))];
                    if (sixthIterateDistint.length > 1) {
                      sixthIterateSort.forEach(x => {
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
        'RankSupplierDA.ts file',
        true,
      );
    }
};
