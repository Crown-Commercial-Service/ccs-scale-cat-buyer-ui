//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { GetLotSuppliers } from '../../shared/supplierService';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/eoi/suppliers.json';
import Mcf3cmsData from '../../../resources/content/MCF3/eoi/suppliers.json';
import config from 'config';
import { Parser } from 'json2csv';

// RFI Suppliers
export const GET_EOI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  try{
  let lotid = req.session.lotId;
  lotid = lotid.replace('Lot ', '')
  const lotSuppliers = config.get('CCS_agreements_url') + req.session.agreement_id + ":" + lotid + "/lot-suppliers";
  const releatedContent = req.session.releatedContent
  const agreementId_session = req.session.agreement_id;
  let forceChangeDataJson;
  if (agreementId_session == 'RM6187') { //MCF3
    forceChangeDataJson = Mcf3cmsData;
  } else {
    forceChangeDataJson = cmsData;
  }
  const { download, previous, next, fromMessage } = req.query;
  let supplierList = [];

  supplierList = await GetLotSuppliers(req);
  //27-08-2022
  if (agreementId_session == 'RM6187') { //MCF3
    const { data: getSuppliersPushed } = await TenderApi.Instance(SESSION_ID).get(`/tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers`);
    let getSuppliersPushedArr = getSuppliersPushed.suppliers;
    if (getSuppliersPushedArr.length > 0) {
      let eptyArr = [];
      var result = getSuppliersPushedArr.forEach((el: any) => {
        eptyArr.push(el.id);
      });
      supplierList = supplierList.filter((el: any) => {
        if (eptyArr.includes(el.organization.id)) {
          return true;
        }
        return false;
      });
    }
  }

  const rowCount = 10; let showPrevious = false, showNext = false;
  supplierList = supplierList.sort((a, b) => a.organization.name.replace("-", " ").toLowerCase() < b.organization.name.replace("-", " ").toLowerCase() ? -1 : a.organization.name.replace("-", " ").toLowerCase() > b.organization.name.replace("-", " ").toLowerCase() ? 1 : 0);
  const supplierLength = supplierList.length;

  let enablebtn = true

  if (fromMessage != undefined) {
    req.session["rfiSuppliersbtn"] = true
  }

  let appendData = {
    data: forceChangeDataJson,
    suppliers_list: supplierList,
    lotSuppliers: lotSuppliers,
    releatedContent: releatedContent,
    supplierLength,
    enablebtn,
    agreementId_session: agreementId_session,
  };
  if (download != undefined) {
    const JsonData: any = [];
    let contactSupplierDetails;

    for (let i = 0; i < appendData.suppliers_list.length; i++) {
      const contact = appendData.suppliers_list[i];
      if (contact.lotContacts != undefined) {
        contact.lotContacts[0].contact['name'] = contact.organization?.name == undefined ? '-' : contact.organization.name;
        contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined ? '-' : contact?.supplierStatus;
        contact.lotContacts[0].contact['address'] = contact?.organization?.address?.streetAddress == undefined ? '-' : contact?.organization?.address?.streetAddress;
        contact.lotContacts[0].contact['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined ? '-' : contact?.organization?.contactPoint?.name;
        contact.lotContacts[0].contact['url'] = contact.organization?.identifier?.uri == undefined ? '-' : contact.organization?.identifier?.uri;
        contactSupplierDetails = contact.lotContacts[0].contact;
      }
      JsonData.push(contactSupplierDetails)
    }

    let fields = ["name", "email", "telephone", "address", "url", "Contact Point name"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(JsonData);
    res.header('Content-Type', 'text/csv');
    res.attachment("EOI_Suppliers_List.csv");
    res.send(csv);

  }
  else {
    let noOfPages = Math.ceil(supplierList.length / rowCount);
    if (previous == undefined && next == undefined) {
      req.session.supplierpagenumber = 1;
      if (supplierList.length <= rowCount) {
        showPrevious = false;
        showNext = false;
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
      else {
        showPrevious = false;
        showNext = true;

        supplierList = supplierList.slice(0, rowCount);
        appendData = {
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber: 1,
          noOfPages,
          enablebtn,
          agreementId_session: req.session.agreement_id
        };
      }
    }
    else {
      if (previous != undefined) {
        let currentpagenumber = req.session.supplierpagenumber;
        let previouspagenumber = currentpagenumber - 1;
        let lastindex = previouspagenumber * rowCount;
        supplierList = supplierList.slice(lastindex - rowCount, lastindex);
        req.session.supplierpagenumber = previouspagenumber;
        if (previouspagenumber == 1) {
          showPrevious = false;
        }
        else {
          showPrevious = true;
        }
        showNext = true;
        appendData = {
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber: previouspagenumber,
          noOfPages,
          enablebtn,
          agreementId_session: req.session.agreement_id
        };
      }
      else {//next is undefined
        let currentpagenumber = req.session.supplierpagenumber;
        let nextpagenumber = currentpagenumber + 1;
        let lastindex = nextpagenumber * rowCount;
        let firstindex = 0;
        if (lastindex > supplierList.length) {
          lastindex = supplierList.length;
          firstindex = currentpagenumber * rowCount;
        }
        else {
          firstindex = lastindex - rowCount;
        }
        supplierList = supplierList.slice(firstindex, lastindex);
        req.session.supplierpagenumber = nextpagenumber;

        if (nextpagenumber == noOfPages) {
          showNext = false;
        }
        else {
          showNext = true;
        }
        showPrevious = true;
        appendData = {
          data: forceChangeDataJson,
          suppliers_list: supplierList,
          lotSuppliers: lotSuppliers,
          releatedContent: releatedContent,
          showPrevious,
          showNext,
          supplierLength,
          currentpagenumber: nextpagenumber,
          noOfPages,
          enablebtn,
          agreementId_session: req.session.agreement_id
        };
      }
    }
    if (fromMessage != undefined) {
      appendData = Object.assign({}, { ...appendData, enablebtn: false })
    }
    res.render('suppliers', appendData);
  }
} catch (error){
  LoggTracer.errorLogger(
    res,
    error,
    `${req.headers.host}${req.originalUrl}`,
    null,
    TokenDecoder.decoder(SESSION_ID),
    'EOI Suppliers - Tender Api - getting users from organization or from tenders failed',
    true,
  );
}

};

export const POST_EOI_SUPPLIERS = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/22`, 'Completed');
  if (response.status == HttpStatusCode.OK) {
    await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/23`, 'Not started');
  }
  res.redirect('/eoi/response-date');
};
