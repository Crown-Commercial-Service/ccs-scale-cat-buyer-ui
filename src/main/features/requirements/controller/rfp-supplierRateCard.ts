import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import * as fcSupplierRatecardScreenContent from '../../../resources/content/MCF3/requirements/rfp-supplier-ratecard.json';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { agreementsService } from 'main/services/agreementsService';
// import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

export const RFP_SUPPLIER_RATECARD = async (req: express.Request, res: express.Response) => {
  req.session.unpublishedeventmanagement = 'false';
  const { supplierId, supplierName } = req.query;
  const { SESSION_ID } = req.cookies;
  // const { eventId, projectId } = req.session;
  const assessmentId = req.session.currentEvent.assessmentId;
  try {
    let assessmentURL = `assessments/${assessmentId}`;
    const assessmentData = await TenderApi.Instance(SESSION_ID).get(assessmentURL);
    const toolId = assessmentData.data['external-tool-id'];
    // var supplier_Id = (supplierId as string).split('-');
    assessmentURL = `/assessments/tools/${toolId}/dimensions/6/data?suppliers=` + supplierId;
    // var assessmentURL = `/assessments/tools/6/dimensions/6/data?suppliers=211345898`;
    const assessmentsData = await (await TenderApi.supplierInstance(SESSION_ID).get(assessmentURL))?.data;
    // let baseURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers/${supplierId}`;
    // const { data: SuppliersData } = await TenderApi.Instance(SESSION_ID).get(baseURL);
    // CSV to JSON start
    /*let allTextLines = assessmentsData.split(/\r|\n|\r/);
    let headers = allTextLines[0].split(','); 
    let lines = [];
    for (let i = 1; i < allTextLines.length; i++) {
      // split content based on comma
      let data = allTextLines[i].split(',');
      if (data.length === headers.length) {
        let tarr = [];
        for (let j = 0; j < headers.length; j++) {
          tarr.push(data[j]);
        }
       lines.push({"name":data[1],"description":'£'+data[5]});
    }
   }*/
    // CSV to JSON End

    /*const tempData = [
      {name: 'Role 1', description: '£X,XXX'},
      {name: 'Role 2', description: '£X,XXX'},
      {name: 'Role 3', description: '£X,XXX'},
      {name: 'Role 4', description: '£X,XXX'},
      {name: 'Role 5', description: '£X,XXX'},
      {name: 'Role 6', description: '£X,XXX'},
    ];*/

    //Supplier Contact Details
    const retrieveSupplierContactDetails = (await agreementsService.api.getAgreementLotSuppliers(req.session.agreement_id, req.session.lotId)).unwrap();
    let contactSupplierDetails;
    const contact = retrieveSupplierContactDetails.find((el: any) => {
      if (el.organization.id === supplierId) {
        return true;
      }
      return false;
    });
    if (contact.lotContacts != undefined) {
      if (contact.lotContacts != undefined) {
        contact.lotContacts[0].contact['address'] = contact.organization.address.streetAddress;
        contact.lotContacts[0].contact['url'] = contact.organization.identifier.uri;
        contactSupplierDetails = contact.lotContacts[0].contact;
      }
    }

    const releatedContent = req.session.releatedContent;

    const appendData = {
      supplierName,
      assessmentsData,
      data: fcSupplierRatecardScreenContent,
      events: req.session.openProjectActiveEvents,
      historicalEvents: req.session.historicalEvents,
      releatedContent: releatedContent,
      contactSupplierDetails: contactSupplierDetails ? contactSupplierDetails : {},
    };
    res.render('rfp-supplier-rate-card', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'FC Shortlist services - FC task list page',
      true
    );
  }
};
