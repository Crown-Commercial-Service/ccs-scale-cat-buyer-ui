//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/RFI/suppliers.json';
import * as Mcf3cmsData from '../../../resources/content/MCF3/RFI/suppliers.json';
import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';

// RFI Suppliers
export const GET_RFI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  try { 
  const agreementId_session = req.session.agreement_id;
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url')+req.session.agreement_id+":"+lotid+"/lot-suppliers";
  const releatedContent = req.session.releatedContent
  const { download,previous,next,fromMessage } = req.query
  let supplierList = [];
  supplierList = await GetLotSuppliers(req);
  //27-08-2022
  if(agreementId_session == 'RM6187') { //MCF3
    const {data: getSuppliersPushed} = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers`);
    let getSuppliersPushedArr = getSuppliersPushed.suppliers;
    if(getSuppliersPushedArr.length > 0) {
      let eptyArr = [];
      var result = getSuppliersPushedArr.forEach((el: any) => {
        eptyArr.push(el.id);
      });
      supplierList = supplierList.filter((el: any) => {
        if(eptyArr.includes(el.organization.id)) {
          return true;
        }
        return false;
      });
    }
  }
  const rowCount=10;let showPrevious=false,showNext=false;
  supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
  const supplierLength=supplierList.length;
  let enablebtn=true	
  if(fromMessage!=undefined)	
  {	
    //req.session["rfiSuppliersbtn"]=true	
  }

    let forceChangeDataJson;
    if(agreementId_session == 'RM6187') { //MCF3
      forceChangeDataJson = Mcf3cmsData;
    } else { 
      forceChangeDataJson = cmsData;
    }

  let appendData = {
    data: forceChangeDataJson,
    suppliers_list: supplierList,
    lotSuppliers: lotSuppliers,
    releatedContent: releatedContent,
    supplierLength,
    enablebtn,
    agreementId_session: req.session.agreement_id
  };

  if(download!=undefined)
  {
    // let csvSupplierList=[];
    // csvSupplierList = appendData.suppliers_list.map(a=>a.organization);
    // let fields = ["name"];
    // const json2csv = new Parser({fields});
    // const csv = json2csv.parse(csvSupplierList);
    // res.header('Content-Type', 'text/csv');
    // res.attachment("Suppliers_List.csv");         
    // res.send(csv);
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

   // let fields = ["name","email","telephone","address","url","Contact Point name"];
   let fields = ["Contact name","Contact email","Contact phone number","Supplier id","Registered company name (Legal name)","Trading name","Registered company address","Url","Status"]; 
    const json2csv = new Parser({fields});
    const csv = json2csv.parse(JsonData);
    res.header('Content-Type', 'text/csv');
    res.attachment("RFI_Suppliers_List.csv");         
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
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          enablebtn,
          agreementId_session: req.session.agreement_id
        };
      }
      else
      {
        showPrevious=false;
        showNext=true;
        
        supplierList=supplierList.slice(0,rowCount);
        appendData = {
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:1,
          noOfPages,
          enablebtn,
          agreementId_session: req.session.agreement_id
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
            data: forceChangeDataJson,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:previouspagenumber,
            noOfPages,
            enablebtn,
            agreementId_session: req.session.agreement_id
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
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:nextpagenumber,
          noOfPages,
          enablebtn,
          agreementId_session: req.session.agreement_id
        };
      }
    }
    
    if(fromMessage!=undefined)
    {	
      appendData= Object.assign({}, { ...appendData, enablebtn: false})	
      
    }

  res.render('supplier', appendData);
  }
}catch (error) {
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'Journey service - GET FAILED - RFI Supplier Page',
    true,
  );
}
};

export const POST_RFI_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  try{
        const { eventId } = req.session;
        const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/12`, 'Completed');
        if (response.status == HttpStatusCode.OK) {
          let flag=await ShouldEventStatusBeUpdated(eventId,13,req);
          if(flag)
          {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/13`, 'Not started');
          }
        }
        res.redirect('/rfi/response-date');
        }catch (error) {
          LoggTracer.errorLogger(
            res,
            error,
            `${req.headers.host}${req.originalUrl}`,
            null,
            TokenDecoder.decoder(SESSION_ID),
            'Journey service - PUT FAILED -  RFI Supplier Page',
            true,
          );
        }
};

//agreement_suppliers_list
