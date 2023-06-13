import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
import { TIMELINEDEPENDENCYHELPER } from '../../requirements/helpers/responsedate';

import { SupplierAddress, SupplierDetails } from '../model/supplierDetailsModel';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { logConstant } from '../../../common/logtracer/logConstant';

export const GET_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { supplierId } = req.query;
  const supplierName = req.session['supplierName'];

  const { projectId, eventId, projectName, agreement_header, agreement_id, lotId, viewError } = req.session;
  try {
    //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierdata, logConstant.getSupplierResponse, req);

    const supplierDetailsList: SupplierDetails[] = [];
    const supplierDetails = {} as SupplierDetails;
    //agreements/{agreement-id}/lots/{lot-id}/suppliers
    const baseurl_Supplier = `agreements/${agreement_id}/lots/${lotId}/suppliers`;
    const supplierDataList = await (await AgreementAPI.Instance(null).get(baseurl_Supplier))?.data;

    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierDataList, logConstant.supplierDetails, req);

    //Supplier score
    const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
    const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

    //CAS-INFO-LOG
    LoggTracer.infoLogger(supplierScore, logConstant.getSupplierScore, req);

    for (let i = 0; i < supplierdata.data.responders.length; i++) {
      const id = supplierdata.data.responders[i].supplier.id;
      const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)?.[0]?.score;

      if (supplierdata.data.responders[i].responseState == 'Submitted') {
        //showallDownload = true;
      }
      if (supplierdata.data.responders[i].supplier.id == supplierId) {
        // let supplierData = supplierDataList.filter((x: any) => x.);
        let supplierFiltedData;
        for (const sdata of supplierDataList) {
          if (sdata.organization.id == id) {
            supplierFiltedData = sdata.organization;
          }
        }
        // var supplierFiltedData = supplierDataList.filter((a: any) => { a.organization.id == id });

        supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
        supplierDetails.responseState = supplierdata.data.responders[i].responseState;
        supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
        supplierDetails.score = score != undefined ? score : 0;

        supplierDetails.supplierAddress = {} as SupplierAddress; // supplierFiltedData != null ? supplierFiltedData.address : "";

        supplierDetails.supplierAddress =
          supplierFiltedData != undefined && supplierFiltedData != null
            ? supplierFiltedData.address?.streetAddress
            : ({} as SupplierAddress);

        supplierDetails.supplierContactName =
          supplierFiltedData != undefined && supplierFiltedData != null ? supplierFiltedData.contactPoint?.name : '';
        supplierDetails.supplierContactEmail =
          supplierFiltedData != undefined && supplierFiltedData != null ? supplierFiltedData.contactPoint?.email : '';
        supplierDetails.supplierWebsite =
          supplierFiltedData != undefined && supplierFiltedData != null ? supplierFiltedData.identifier?.uri : '';
        supplierDetails.supplierId = id;
        supplierDetailsList.push(supplierDetails);
      }
    }

    //SELECTED EVENT DETAILS FILTER FORM LIST
    const baseurl = `/tenders/projects/${projectId}/events`;
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
    //status=apidata.data[0].dashboardStatus;
    const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
    const status = selectedEventData[0].dashboardStatus;
    const eventType = selectedEventData[0].eventType;

    const appendData = {
      eventType: eventType,
      supplierName: supplierName,
      status,
      supplierDetails,
      supplierDetailsList,
      projectName,
      agreement_header,
      viewError,
      eventId,
    };

    //CAS-INFO-LOG
    LoggTracer.infoLogger(null, logConstant.awardSupplierPageLogg, req);

    res.render('awardSupplier', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Award Supplier - Tenders Service Api cannot be connected',
      true
    );
  }
};

export const POST_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { award_supplier_confirmation, supplier_id } = req.body;
  const { SESSION_ID } = req.cookies;
  const baseurl = `/tenders/projects/${req.session.projectId}/events`;
  const { eventId, projectId } = req.session;
  const agreementId_session = req.session.agreement_id;

  const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
  //status=apidata.data[0].dashboardStatus;
  const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
  const eventType = selectedEventData[0].eventType;

  // const { supplierId } = req.query;
  try {
    if (award_supplier_confirmation != undefined && award_supplier_confirmation === '1') {
      //res.redirect('/stand-period');
      let state = '';
      let redirectState = false;
      const getData: any = await TIMELINEDEPENDENCYHELPER(req, res);

      if (eventType == 'DA') {
        state = 'AWARD';
        redirectState = true;
      } else if (getData == null) {
        redirectState = false;
        // } else if (agreementId_session == 'RM1043.8' && getData.Q10.value == 'Yes' && getData.Q10.selected == true) {
        //   state = 'PRE_AWARD';
        //   redirectState = true;
        // } else if (agreementId_session == 'RM1043.8' && getData.Q10.value == 'No' && getData.Q10.selected == true) {
        //   state = 'AWARD';
        //   redirectState = true;
      } else if (agreementId_session == 'RM1043.8' && getData.Q5.value == 'Yes' && getData.Q5.selected == true) {
        state = 'PRE_AWARD';
        redirectState = true;
      } else if (agreementId_session == 'RM1043.8' && getData.Q5.value == 'No' && getData.Q5.selected == true) {
        state = 'AWARD';
        redirectState = true;
      } else if (agreementId_session == 'RM6187' && getData.Q8.value == 'Yes' && getData.Q8.selected == true) {
        state = 'PRE_AWARD';
        redirectState = true;
      } else if (agreementId_session == 'RM6187' && getData.Q8.value == 'No' && getData.Q8.selected == true) {
        state = 'AWARD';
        redirectState = true;
      }
      if (redirectState == true) {
        const body = {
          suppliers: [
            {
              id: supplier_id,
            },
          ],
        };

        const awardURL = `tenders/projects/${projectId}/events/${eventId}/awards?award-state=${state}`;

        await TenderApi.Instance(SESSION_ID).post(awardURL, body);
        res.redirect('/event/management?id=' + eventId);
      } else {
        res.redirect('/stand-period');
      }
    } else {
      req.session['viewError'] = true;
      res.redirect('award-supplier?supplierId=' + supplier_id);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Award Supplier - Tenders Service Api cannot be connected',
      true
    );
  }
};

// export const POST_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
//   const { award_supplier_confirmation, supplier_id } = req.body;
//   const { SESSION_ID } = req.cookies;

//   // const { supplierId } = req.query;
//   try {
//     if (award_supplier_confirmation != undefined && award_supplier_confirmation === '1') {
//       res.redirect('/stand-period');
//     } else {
//       req.session['viewError'] = true;
//       res.redirect('award-supplier?supplierId=' + supplier_id);
//     }
//   } catch (error) {
//     LoggTracer.errorLogger(
//       res,
//       error,
//       `${req.headers.host}${req.originalUrl}`,
//       null,
//       TokenDecoder.decoder(SESSION_ID),
//       'Award Supplier - Tenders Service Api cannot be connected',
//       true
//     );
//   }
// };
