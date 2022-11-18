import * as express from 'express';
import * as fcaShortlistServiceScreenContent from '../../../resources/content/fca/shortlist_service.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
//import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { GetLotSuppliers } from '../../shared/supplierService';
import { GetLotSuppliersScore } from '../../shared/supplierServiceScore';
import * as supplierIDSData from '../../../resources/content/fca/shortListed.json';

var { Parser } = require("json2csv");

// import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const POST_SHORTLIST_SERVICE = async (req: express.Request, res: express.Response) => {
    const { eventId,projectId } = req.session;
    const { SESSION_ID } = req.cookies;
    try {
    // const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    // const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    // let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    let supplierList = []; 
    supplierList = await GetLotSuppliers(req);
    const PAShortlistedSuppliers = req.session.PAShortlistedSuppliers;
    
    if(PAShortlistedSuppliers != undefined && PAShortlistedSuppliers.length > 0){
 
      const MatchedSupplierIDS : any = [];
      for(i=0;i<PAShortlistedSuppliers.length;i++){
        if(supplierIDSData['supplierIDS'].includes(PAShortlistedSuppliers[i])) MatchedSupplierIDS.push(PAShortlistedSuppliers[i]);
      }
      
      if(MatchedSupplierIDS.length > 0){
        
        const UnqfinalArrayOutput = MatchedSupplierIDS.filter((value:any, index:any, self:any) => {
          return self.indexOf(value) === index;
        });

        let supplierDataToSave=[];
        if(UnqfinalArrayOutput.length > 0){
          for(var i=0;i<UnqfinalArrayOutput.length;i++)
          {
              let supplierInfo=supplierList.filter((s:any)=>s.organization.id==UnqfinalArrayOutput[i])?.[0];
              if(supplierInfo!=undefined)
              {
                supplierDataToSave.push({'name':supplierInfo.organization.name,'id':UnqfinalArrayOutput[i]});
              }
          }
        }
  
        if(supplierDataToSave.length > 0){
          const supplierBody = {
            "suppliers": supplierDataToSave,
            "justification": '',
            "overwriteSuppliers":true
          };
   
          const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
          await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, supplierBody); 

          //Journet Update
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/79`, 'Completed');
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/80`, 'Not started');

          res.redirect('/fca/next-step');

        }

      }
    }else{
      req.session['issupllierError'] = true;
      res.redirect('/fca/shortlisted/suppliers');
    }

    // let supplierDataToSave=[];
    // if(SUPPLIER_DATA.suppliers.length > 0){
    //   for(var i=0;i<SUPPLIER_DATA.suppliers.length;i++)
    //   {
    //       let supplierInfo=supplierList.filter((s:any)=>s.organization.id==SUPPLIER_DATA.suppliers[i].id)?.[0];
    //       if(supplierInfo!=undefined)
    //       {
    //         supplierDataToSave.push({'name':supplierInfo.organization.name,'id':SUPPLIER_DATA.suppliers[i].id});
    //       }
    //   }
    // }
     
  } catch (error) {
    LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null, TokenDecoder.decoder(SESSION_ID), 'Shortlist services - FCA task list page', true);
  }
 }
 export const SHORTLIST_SERVICE = async (req: express.Request, res: express.Response) => {
  const { lotId, agreementLotName, eventId, projectId, agreement_id } = req.session;
  const { issupllierError } = req.session;
  req.session['issupllierError'] = false;
  const { download } = req.query;
  const { SESSION_ID } = req.cookies;
  try {
      
      const releatedContent = req.session.releatedContent;
      const agreementName = req.session.agreementName;
      const project_name = req.session.project_name;
      let agreementId_session = agreement_id;

      //24-08=2022
      const {data: getEventsData} = await TenderApi.Instance(SESSION_ID).get(`tenders/projects/${projectId}/events`);
      let assessmentId;
      if(agreementId_session == 'RM6187') { //MCF3
        const overWritePaJoury = getEventsData.find((item: any) => item.eventType == 'PA' && (item.dashboardStatus == 'CLOSED' || item.dashboardStatus == 'COMPLETED'));
        if(overWritePaJoury)  {
          assessmentId = overWritePaJoury.assessmentId;
        } else {
          assessmentId = req.session.currentEvent.assessmentId;
        }
      } else {  //DSP
        assessmentId = req.session.currentEvent.assessmentId;
      }
      
      const assessmentURL=`assessments/${assessmentId}`;
      const {data: assessmentData} = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
      var selected_service_value: any[] = [];
      var selected_service_text_value: any[] = [];
      if(assessmentData.dimensionRequirements.length > 0) {
        const selected_services = assessmentData.dimensionRequirements[0].requirements;
        selected_services.filter((el: any) =>  {
          selected_service_text_value.push(el.name);
        });
      }
      
      //Pagination concept
      let lotid=req.session.lotId;
      lotid = lotid.replace('Lot ','');
      let lot_id = lotid;
      res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid, eventId, projectId };

      const { previous, next } = req.query
      let supplierList: any[] = [];
      let supplierScoreList = await GetLotSuppliersScore(req, true);
      let lengthGet = supplierScoreList?.dimensionRequirements[0]?.requirements.length;
      let weightGet = supplierScoreList?.dimensionRequirements[0]?.requirements[0].weighting;
      // const maxResult = ((((weightGet * lengthGet) * 100) / 100) / 4);
      const maxResult = weightGet * lengthGet;
      let scoreArray = supplierScoreList.scores;
      const resultScoreSupplier = scoreArray.filter((el: any) => el.total == maxResult);
      //const resultScoreSupplier=scoreArray;
      let resultScoreSupplierIds = resultScoreSupplier.map((value: any) => value.supplier.id);
      /*patch */
      const MatchedSupplierIDS : any = [];
      for(let i=0;i<resultScoreSupplierIds.length;i++){
        if(supplierIDSData['supplierIDS'].includes(resultScoreSupplierIds[i])) MatchedSupplierIDS.push(resultScoreSupplierIds[i]);
      }
      const UnqMatchedSupplierIDS = MatchedSupplierIDS.filter((value:any, index:any, self:any) => {
        return self.indexOf(value) === index;
      });
      /*patch */

      supplierList = await GetLotSuppliers(req);
      supplierList = supplierList.filter((el: any) => {
        if(UnqMatchedSupplierIDS.includes(el.organization.id)) {
          return true;
        }
        return false;
      });

      
      const rowCount=10;let showPrevious=false,showNext=false;
      supplierList = supplierList.sort((a: any, b: any) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
      const supplierLength = supplierList.length;
      let supplierPostIds = supplierList.map((value: any) => value.organization.id);
      if(supplierPostIds.length > 0){
        req.session['PAShortlistedSuppliers'] = supplierPostIds;
      }else{
        req.session['PAShortlistedSuppliers'] = [];
      }
      
      //Step 80 Is that completed
      const { data: journeySteps } = await TenderApi.Instance(SESSION_ID).get(`journeys/${eventId}/steps`);
      let actualStatus = journeySteps.find((d: any) => d.step == 80)?.state;
      const submitBtnDisable = (actualStatus == 'Completed') ? 'disabled' : '';

      let appendData;
      let noOfPages=Math.ceil(supplierList.length/rowCount);

      if(previous==undefined && next==undefined)
      {
        req.session.supplierpagenumber = 1;
        if(supplierList.length <= rowCount) {
          showPrevious = false;
          showNext = false;

          appendData = { 
            data: fcaShortlistServiceScreenContent,
            lotId,
            releatedContent,
            agreement_id,
            agreementLotName,
            lot_id,
            agreementId_session,
            selected_service_value:selected_service_value,
            selected_service_text_value:selected_service_text_value,
            suppliers_list: supplierList,
            showPrevious,
            showNext,
            supplierLength,
            error: issupllierError,
            submitBtnDisable
          };
        } else {
          showPrevious=false;
          showNext=true;
          supplierList = supplierList.slice(0,rowCount);

          appendData = { 
            data: fcaShortlistServiceScreenContent,
            lotId,
            releatedContent,
            agreement_id,
            agreementLotName,
            lot_id,
            agreementId_session,
            selected_service_value:selected_service_value,
            selected_service_text_value:selected_service_text_value,
            suppliers_list: supplierList,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:1,
            noOfPages,
            error: issupllierError,
            submitBtnDisable
          };
        }
      } else {
        if(previous!=undefined) {
            let currentpagenumber=req.session.supplierpagenumber;
            let previouspagenumber=currentpagenumber-1;
            let lastindex=previouspagenumber*rowCount;
            supplierList=supplierList.slice(lastindex-rowCount,lastindex);
            req.session.supplierpagenumber=previouspagenumber;
            if(previouspagenumber == 1) {
              showPrevious=false;
            } else {
              showPrevious=true;
            }
            showNext=true;

            appendData = { 
              data: fcaShortlistServiceScreenContent,
              lotId,
              releatedContent,
              agreement_id,
              agreementLotName,
              lot_id,
              agreementId_session,
              selected_service_value:selected_service_value,
              selected_service_text_value:selected_service_text_value,
              suppliers_list: supplierList,
              showPrevious,
              showNext,
              supplierLength,
              currentpagenumber:previouspagenumber,
              noOfPages,
              error: issupllierError,
              submitBtnDisable
            };
        } else {  //next is undefined
          let currentpagenumber=req.session.supplierpagenumber;
          let nextpagenumber=currentpagenumber+1;
          let lastindex=nextpagenumber*rowCount;
          let firstindex=0;
          if(lastindex > supplierList.length) {
            lastindex=supplierList.length;
            firstindex=currentpagenumber*rowCount;
          } else {
            firstindex=lastindex-rowCount;
          }
          supplierList=supplierList.slice(firstindex,lastindex);
          req.session.supplierpagenumber=nextpagenumber;
          
          if(nextpagenumber==noOfPages) {
            showNext=false;
          } else {
            showNext=true;
          }
          showPrevious=true;
          appendData = { 
            data: fcaShortlistServiceScreenContent,
            lotId,
            releatedContent,
            agreement_id,
            agreementLotName,
            lot_id,
            agreementId_session,
            selected_service_value:selected_service_value,
            selected_service_text_value:selected_service_text_value,
            suppliers_list: supplierList,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:nextpagenumber,
            noOfPages,
            error: issupllierError,
            submitBtnDisable
          };
        }
      }



      if(download!=undefined)
      {

        const BaseURLSupplierContact = `agreements/${req.session.agreement_id}/lots/${req.session.lotId}/suppliers`;
        const {data: retrieveSupplierContactDetails} = await AgreementAPI.Instance.get(BaseURLSupplierContact);
        const JsonData:any = [];
        let contactSupplierDetails;
        
        for(let i=0;i<supplierPostIds.length;i++){
          
          const contact = retrieveSupplierContactDetails.find((el: any) => {
            if(el.organization.id == supplierPostIds[i]) { return true; }
              return false;
          });          
          let contactData:any = [];

          // if(contact.lotContacts != undefined) {
             contactData['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
             // contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
             contactData['status'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
             contactData['address'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
             contactData['Contact Point name'] = contact?.organization?.contactPoint?.telephone == undefined?'-': contact?.organization?.contactPoint?.telephone;
             contactData['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
              contactSupplierDetails = contactData;
             JsonData.push(contactSupplierDetails)
        }
        let fields = ["name","email","telephone","address","url","Contact name","Contact number"];
        const json2csv = new Parser({fields});
        const csv = json2csv.parse(JsonData);
        res.header('Content-Type', 'text/csv');
        res.attachment("PA_Suppliers_List.csv");         
        res.send(csv);
      }else{
        res.render('shortlist_service', appendData);
      }
    
    } catch (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null, TokenDecoder.decoder(SESSION_ID), 'Shortlist services - FCA task list page', true);
    }
  }

 /*const GET_DIMENSIONS_BY_ID = async (sessionId: any, toolId: any) => {
   const baseUrl = `assessments/tools/${toolId}/dimensions`;
   const dimensionsApi = await TenderApi.Instance(sessionId).get(baseUrl);
   return dimensionsApi.data;
 };*/

