//@ts-nocheck
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { Parser } from 'json2csv';
import { GetLotSuppliers } from '../../shared/supplierService';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 */
export const EXPORT_SUPPLIER_FILTERING = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, projectName, agreement_id, lotId } = req.session;
  const fields = ['name', 'id'];
  const filename = ['Suppliers-', Date.now()].join('');
  const json2csv = new Parser({ fields });

  try {
      
    const supplierInterestURL = `tenders/projects/${req.session.projectId}/events/${req.session.eventId}/suppliers`;
    //  const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
    const suppliersList=supplierdata.data.suppliers;
    const MatchedSupplierIDS : any = [];
    for(let i=0;i<suppliersList.length;i++){
    
      // if(supplierIDSData['supplierIDS'].includes(suppliersList[i].id)) 
      MatchedSupplierIDS.push(suppliersList[i].id);
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
      
    supplierList = supplierList.sort((a: any, b: any) => a.organization.name.replace('-',' ').toLowerCase() < b.organization.name.replace('-',' ').toLowerCase() ? -1 : a.organization.name.replace('-',' ').toLowerCase() > b.organization.name.replace('-',' ').toLowerCase() ? 1 : 0);
    const supplierListDwn = supplierList;

    const JsonData:any = [];
    let contactSupplierDetails;
        
    for(let i=0;i<supplierListDwn.length;i++){
      const contact = supplierListDwn[i];
      const contactData:any = [];
      // if(contact.lotContacts != undefined) {
      //   contact.lotContacts[0].contact['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
      //   contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
      //   contact.lotContacts[0].contact['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
      //   contact.lotContacts[0].contact['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
      //   contact.lotContacts[0].contact['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
      //   contactSupplierDetails = contact.lotContacts[0].contact;
      // }
      contactData['Contact name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
      contactData['Contact email'] = contact?.organization?.contactPoint?.email == undefined?'-': contact?.organization?.contactPoint?.email;
      contactData['Contact phone number'] = contact?.organization?.contactPoint?.telephone == undefined?'-': contact?.organization?.contactPoint?.telephone;
      contactData['Supplier id'] = contact.organization?.name == undefined?'-': contact.organization.id;
      contactData['Registered company name (Legal name)'] = contact.organization?.name == undefined?'-': contact.organization.name;
      const streetAddress = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
      const locality = contact?.organization?.address?.locality == undefined?'-': contact?.organization?.address?.locality;
            
      const postalCode = contact?.organization?.address?.postalCode == undefined?' ': contact?.organization?.address?.postalCode;
      const countryName = contact?.organization?.address?.countryName == undefined?' ': contact?.organization?.address?.countryName;
      const countryCode = contact?.organization?.address?.countryCode == undefined?' ': contact?.organization?.address?.countryCode;
            
      contactData['Registered company address'] = streetAddress+' '+locality+' '+postalCode+' '+countryName+' '+countryCode;
      // contactData['Legal name'] = contact.organization?.identifier?.legalName == undefined?'-': contact.organization?.identifier?.legalName;
      contactData['Trading name'] = contact.organization?.details?.tradingName == undefined?'-': contact.organization?.details?.tradingName;
      contactData['Url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
      contactData['Status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
      contactSupplierDetails = contactData;

      JsonData.push(contactSupplierDetails);
    }
    
    // let fields = ["name","email","telephone","address","url","Contact Point name"];
    const fields = ['Contact name','Contact email','Contact phone number','Supplier id','Registered company name (Legal name)','Trading name','Registered company address','Url','Status'];
    const json2csv = new Parser({fields});
    const csv = json2csv.parse(JsonData);
    res.header('Content-Type', 'text/csv');
    res.attachment('Suppliers.csv');         
    res.send(csv);

  //  var make = JSON.stringify(supplierdata.data.suppliers);
  //  const csv = json2csv.parse(supplierdata.data.suppliers);
  //  const csv = json2csv.parse(supplierListDwn);
  //  res.setHeader('Content-disposition', `attachment; filename=${filename}.csv`);
  //  res.set('Content-Type', 'text/csv');
  //  res.status(200).send(csv);
  } catch (err) {
    LoggTracer.errorLogger(res, err, `${req.headers.host}${req.originalUrl}`, null, TokenDecoder.decoder(SESSION_ID), 'Journey service - FCA - Create supplier list page', true);
  }
};