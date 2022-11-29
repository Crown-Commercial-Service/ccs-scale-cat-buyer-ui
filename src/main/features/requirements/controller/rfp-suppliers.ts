//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsDataDCP from '../../../resources/content/requirements/suppliers.json';
import * as cmsDataMCF from '../../../resources/content/MCF3/requirements/suppliers.json';
import * as cmsDataGCLOUD from '../../../resources/content/requirements/suppliersGcloud.json';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import config from 'config';
import { Blob } from 'buffer';
import { JSDOM } from 'jsdom';
import { Parser } from 'json2csv';
import {ShouldEventStatusBeUpdated} from '../../shared/ShouldEventStatusBeUpdated';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

// RFI Suppliers
export const GET_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt

  let cmsData;
  if(req.session.agreement_id == 'RM6187') {
    //MCF3
    cmsData = cmsDataMCF;
  } else if(req.session.agreement_id == 'RM6263') {
    //DSP
    cmsData = cmsDataDCP;
  }else if(req.session.agreement_id == 'RM1557.13') {
    //DSP
    cmsData = cmsDataGCLOUD;
  }

  const { projectId ,eventId} = req.session;
  const { download,previous,next,fromMessage } = req.query
  const releatedContent = req.session.releatedContent
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + lotid + "/lot-suppliers";
  try {
    let flag=await ShouldEventStatusBeUpdated(eventId,39,req);
    if(flag)
    {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/39`, 'In progress');
    }
    let supplierList = [];
    const supplierBaseURL: any = `/tenders/projects/${projectId}/events/${req.session.eventId}/suppliers`;
    const SUPPLIERS = await DynamicFrameworkInstance.Instance(SESSION_ID).get(supplierBaseURL);
    let SUPPLIER_DATA = SUPPLIERS?.data;//saved suppliers
    if(SUPPLIER_DATA!=undefined){
      let allSuppliers=await GetLotSuppliers(req);
      for(var i=0;i<SUPPLIER_DATA.suppliers.length;i++)
          {
              let supplierInfo=allSuppliers.filter(s=>s.organization.id==SUPPLIER_DATA.suppliers[i].id)?.[0];
              if(supplierInfo!=undefined)
              {
                supplierList.push(supplierInfo);
              }
          }
    }
    else{
    supplierList = await GetLotSuppliers(req);
    }
    const rowCount=10;let showPrevious=false,showNext=false;
    const agreementId_session = req.session.agreement_id;
    supplierList=supplierList.sort((a, b) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
    const supplierListDwn = supplierList;
    const supplierLength=supplierList.length;
    let enablebtn=true	
    
    if(fromMessage!=undefined)	
    {	
     // req.session["rfiSuppliersbtn"]=true	
    }
    
    let appendData = {
      data: cmsData,
      suppliers_list: supplierList,
      releatedContent: releatedContent,
      lotSuppliers: lotSuppliers,
      supplierLength,enablebtn,
      agreementId_session
    };
    
    if(download!=undefined)
  {
    const JsonData:any = [];
    let contactSupplierDetails;
    /*for(let i=0;i<appendData.suppliers_list.length;i++){
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
      contactData['Registered company name'] = contact.organization?.name == undefined?'-': contact.organization.name;
      const streetAddress = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
      const locality = contact?.organization?.address?.locality == undefined?'-': contact?.organization?.address?.locality;
      
      const postalCode = contact?.organization?.address?.postalCode == undefined?' ': contact?.organization?.address?.postalCode;
      const countryName = contact?.organization?.address?.countryName == undefined?' ': contact?.organization?.address?.countryName;
      const countryCode = contact?.organization?.address?.countryCode == undefined?' ': contact?.organization?.address?.countryCode;
      
      contactData['Registered company address'] = streetAddress+" "+locality+" "+postalCode+" "+countryName+" "+countryCode;
      contactData['Legal name'] = contact.organization?.identifier?.legalName == undefined?'-': contact.organization?.identifier?.legalName;
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
    }*/    
    for(let i=0;i<supplierListDwn.length;i++){
      const contact = supplierListDwn[i];
      let contactData:any = [];
      // if(contact.lotContacts != undefined) {
        // contact.lotContacts[0].contact['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
        // contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
        // contact.lotContacts[0].contact['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
        // contact.lotContacts[0].contact['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
        // contact.lotContacts[0].contact['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
        // contactData['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
        // contactData['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
        // contactData['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
        // contactData['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
        // contactData['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
       // contactSupplierDetails = contactData;
        contactData['Supplier id'] = contact.organization?.name == undefined?'-': contact.organization.id;
        contactData['Contact name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
        contactData['Contact email'] = contact?.organization?.contactPoint?.email == undefined?'-': contact?.organization?.contactPoint?.email;
        contactData['Contact phone number'] = contact?.organization?.contactPoint?.telephone == undefined?'-': contact?.organization?.contactPoint?.telephone;
        contactData['Registered company name'] = contact.organization?.name == undefined?'-': contact.organization.name;
        const streetAddress = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
        const locality = contact?.organization?.address?.locality == undefined?'-': contact?.organization?.address?.locality;
        
        const postalCode = contact?.organization?.address?.postalCode == undefined?' ': contact?.organization?.address?.postalCode;
        const countryName = contact?.organization?.address?.countryName == undefined?' ': contact?.organization?.address?.countryName;
        const countryCode = contact?.organization?.address?.countryCode == undefined?' ': contact?.organization?.address?.countryCode;
        
        contactData['Registered company address'] = streetAddress+" "+locality+" "+postalCode+" "+countryName+" "+countryCode;
        contactData['Url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
        contactData['Status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
        
        // contactData['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
        // contactData['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
        // contactData['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
        // contactData['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
         contactSupplierDetails = contactData;

      // }
      JsonData.push(contactSupplierDetails)
    }
    // let fields = ["name","email","telephone","address","url","Contact Point name","status"];    //let fields = ["name","email","telephone","address","url","Contact Point name"];
    let fields = ["Contact name","Contact email","Contact phone number","Supplier id","Registered company name","Legal name","Trading name","Registered company address","Url","Status"]; 

    const json2csv = new Parser({fields});
    const csv = json2csv.parse(JsonData);
    res.header('Content-Type', 'text/csv');
    res.attachment("FC_Suppliers_List.csv");         
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
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,enablebtn,
          agreementId_session
        };
      }
      else
      {
        showPrevious=false;
        showNext=true;
        
        supplierList=supplierList.slice(0,rowCount);
        appendData = {
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:1,
          noOfPages,enablebtn,
          agreementId_session
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
            data: cmsData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:previouspagenumber,
            noOfPages,enablebtn,
            agreementId_session
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
          data: cmsData,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber:nextpagenumber,
          noOfPages,enablebtn,
          agreementId_session
        };
      }
    }

    if(fromMessage!=undefined)
    {	
      appendData= Object.assign({}, { ...appendData, enablebtn: false})	
    }

    res.render('rfp-suppliers', appendData);
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

export const POST_RFP_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  try {
    if(req.session.agreement_id == 'RM1557.13') {

      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      let flag=await ShouldEventStatusBeUpdated(eventId,36,req);
      if(flag)
      {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
    }
  }

    }else{
      const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/35`, 'Completed');
    if (response.status == HttpStatusCode.OK) {
      let flag=await ShouldEventStatusBeUpdated(eventId,36,req);
      if(flag)
      {
      await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/36`, 'Not started');
    }
  }
    }
    
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
