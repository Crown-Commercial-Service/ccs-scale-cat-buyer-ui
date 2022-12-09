//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
// import * as cmsDataDCP from '../../../resources/content/requirements/suppliers.json';
import * as daData from '../../../resources/content/da/da-suppliers.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import * as supplierIDSData from '../../../resources/content/fca/shortListed.json';

// RFI Suppliers
export const GET_DA_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
//   let cmsData;
//   if(req.session.agreement_id == 'RM6187') {
//     //MCF3
//     cmsData = cmsDataMCF;
//   } else if(req.session.agreement_id == 'RM6263') {
//     //DSP
//     cmsData = cmsDataDCP;
//   }

  const agreementId_session = req.session.agreement_id;
  const { projectId ,eventId} = req.session;
  const { download,previous,next,fromMessage } = req.query;
  const { isEmptySelectedSupplierError } = req.session;
  req.session['isEmptySelectedSupplierError'] = false;
  const releatedContent = req.session.releatedContent
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + lotid + "/lot-suppliers";
  try {
    
    let flag=await ShouldEventStatusBeUpdated(eventId,34,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'In progress');
    }
    
    //supplierList = await GetLotSuppliers(req);
    
    const supplierURL=`/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(supplierURL); 
    let radioSelected;
    if(req.session.selectedSuppliersDA != undefined) {
      radioSelected = req.session.selectedSuppliersDA;
    } else {
      
      radioSelected = '';//suppliers.suppliers[0].id;
    }
    
    const suppliersList=suppliers.suppliers;
    /*patch */
    const MatchedSupplierIDS : any = [];
    for(let i=0;i<suppliersList.length;i++){
    
      if(supplierIDSData['supplierIDS'].includes(suppliersList[i].id)) MatchedSupplierIDS.push(suppliersList[i].id);
    }
   
    const UnqMatchedSupplierIDS = MatchedSupplierIDS.filter((value:any, index:any, self:any) => {
      return self.indexOf(value) === index;
    });
    /*patch */
    let supplierList = [];
      supplierList = await GetLotSuppliers(req);
      supplierList = supplierList.filter((el: any) => {
        if(UnqMatchedSupplierIDS.includes(el.organization.id)) {
          return true;
        }
        return false;
      });

      let supplierPostIds = supplierList.map((value: any) => value.organization.id);
      if(supplierPostIds.length > 0){
        req.session['PAShortlistedSuppliers'] = supplierPostIds;
      }else{
        req.session['PAShortlistedSuppliers'] = [];
      }

    const rowCount=10;let showPrevious=false,showNext=false;
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierLength=supplierList.length;
    let enablebtn=true	
  if(fromMessage!=undefined)	
  {	
    //req.session["rfiSuppliersbtn"]=true	
  }

    let appendData = {
      data: daData,
      error: isEmptySelectedSupplierError,
      suppliers_list: supplierList,
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
      supplierLength,
      radioSelected,
      enablebtn,
      agreementId_session,
    };
    if(download!=undefined)
  {
    const JsonData:any = [];
    let contactSupplierDetails;
   
    for(let i=0;i<appendData.suppliers_list.length;i++){
      const contact = appendData.suppliers_list[i];

      let contactData:any = [];
      contactData['Contact name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
      if(contact.lotContacts != undefined) {
        contactData['Contact email'] = contact?.lotContacts[0]?.contact?.email == undefined?'-': contact?.lotContacts[0]?.contact?.email;
        contactData['Contact phone number'] = contact?.lotContacts[0]?.contact?.telephone == undefined?'-': contact?.lotContacts[0]?.contact?.telephone;
        }else{
          contactData['Contact email'] = '-';
          contactData['Contact phone number'] = '-';
        }

        contactData['Supplier id'] = contact.organization?.name == undefined?'-': contact.organization.id;
      contactData['Registered company name (Legal name)'] = contact.organization?.name == undefined?'-': contact.organization.name;
      const streetAddress = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
      const locality = contact?.organization?.address?.locality == undefined?'-': contact?.organization?.address?.locality;
      
      const postalCode = contact?.organization?.address?.postalCode == undefined?' ': contact?.organization?.address?.postalCode;
      const countryName = contact?.organization?.address?.countryName == undefined?' ': contact?.organization?.address?.countryName;
      const countryCode = contact?.organization?.address?.countryCode == undefined?' ': contact?.organization?.address?.countryCode;
      
      contactData['Registered company address'] = streetAddress+" "+locality+" "+postalCode+" "+countryName+" "+countryCode;
      // contactData['Legal name'] = contact.organization?.identifier?.legalName == undefined?'-': contact.organization?.identifier?.legalName;
      contactData['Trading name'] = contact.organization?.details?.tradingName == undefined?'-': contact.organization?.details?.tradingName;
      contactData['Url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
      contactData['Status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
      
      // if(contact.lotContacts != undefined) {
      //   contact.lotContacts[0].contact['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
      //   contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
      //   contact.lotContacts[0].contact['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
      //   contact.lotContacts[0].contact['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
      //   contact.lotContacts[0].contact['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
      //   contactSupplierDetails = contact.lotContacts[0].contact;
      // }
      contactSupplierDetails = contactData;
      JsonData.push(contactSupplierDetails)
    }

    //let fields = ["name","email","telephone","address","url","Contact Point name"];
    let fields = ["Contact name","Contact email","Contact phone number","Supplier id","Registered company name (Legal name)","Trading name","Registered company address","Url","Status"]; 
    const json2csv = new Parser({fields});
    const csv = json2csv.parse(JsonData);
    res.header('Content-Type', 'text/csv');
    res.attachment("DA_Suppliers_List.csv");         
    res.send(csv);
  }
  else{
    let noOfPages=Math.ceil(supplierList.length/rowCount);
    if(previous==undefined && next==undefined)
    {
      req.session.supplierpagenumber=1;
      if(supplierList.length<=rowCount)
      {
        showPrevious=false;
        showNext=false;
        appendData = {
          data: daData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          error: isEmptySelectedSupplierError,
          showPrevious,
          showNext,
          supplierLength,
          radioSelected,
          enablebtn,
          agreementId_session,
        };
      }
      else
      {
        showPrevious=false;
        showNext=true;
        
        supplierList=supplierList.slice(0,rowCount);
        appendData = {
          data: daData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          error: isEmptySelectedSupplierError,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:1,
          noOfPages,
          radioSelected,
          enablebtn,
          agreementId_session,
        };
      }
    }
    else
    {
      if(previous!=undefined)
      {
          let currentpagenumber=req.session.supplierpagenumber;
          let previouspagenumber=currentpagenumber-1;
          let lastindex=previouspagenumber*rowCount;
          supplierList=supplierList.slice(lastindex-rowCount,lastindex);
          req.session.supplierpagenumber=previouspagenumber;
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
            data: daData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            error: isEmptySelectedSupplierError,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:previouspagenumber,
            noOfPages,
            radioSelected,
            enablebtn,
            agreementId_session,
          };
      }
      else{//next is undefined
        let currentpagenumber=req.session.supplierpagenumber;
        let nextpagenumber=currentpagenumber+1;
        let lastindex=nextpagenumber*rowCount;
        let firstindex=0;
        if(lastindex > supplierList.length)
        {
          lastindex=supplierList.length;
          firstindex=currentpagenumber*rowCount;
        }
        else
        {
          firstindex=lastindex-rowCount;
        }
        supplierList=supplierList.slice(firstindex,lastindex);
        req.session.supplierpagenumber=nextpagenumber;
        
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
          data: daData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          error: isEmptySelectedSupplierError,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:nextpagenumber,
          noOfPages,
          radioSelected,
          enablebtn,
          agreementId_session,
        };
      }
    }
    if(fromMessage!=undefined)
    {	
      appendData= Object.assign({}, { ...appendData, enablebtn: false})	
      
    }
    res.render('daw-suppliers', appendData);
  }
  } catch (error) {

    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Suppliers page error - RFP',
      true,
    );
  }
};

export const POST_DA_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { projectId,eventId } = req.session;
  const  da_selected_supplier = req.body;
  
   try {
    if(da_selected_supplier?.supplier_list != undefined && da_selected_supplier.supplier_list.length > 0){
      req.session.selectedSuppliersDA = da_selected_supplier.supplier_list;

  //     let supplierList = []; 
  //     supplierList = await GetLotSuppliers(req);
  //     let supplierDataToSave=[];
  //     if(da_selected_supplier?.supplier_list.length > 0){
  //       let supplierInfo=supplierList.filter((s:any)=>s.organization.id==da_selected_supplier?.supplier_list)?.[0];
  //           if(supplierInfo!=undefined)
  //           {
  //             supplierDataToSave.push({'name':supplierInfo.organization.name,'id':da_selected_supplier?.supplier_list});
  //           }    
  //     }

  //       const supplierBody = {
  //         "suppliers": supplierDataToSave,
  //         "justification": 'string',
  //         "overwriteSuppliers": false
  //       };
  
  //       const Supplier_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers`;
  //       await TenderApi.Instance(SESSION_ID).post(Supplier_BASEURL, supplierBody); 

    // const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
    // if (response.status == HttpStatusCode.OK) {
    //     let flag=await ShouldEventStatusBeUpdated(eventId,36,req);
    //     if(flag)
    //     {
    //       await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
    //     }
    // }
    
    const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/34`, 'Completed');

    
    let flag=await ShouldEventStatusBeUpdated(eventId,35,req);
    if(flag) {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Not started');
    }
    
     res.redirect('/da/response-date');
    }
    else{
      req.session['isEmptySelectedSupplierError'] = true;
      res.redirect('/da/suppliers');
    }

  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'DA Suppliers page error - RFP',
      true,
    );
  }
};
