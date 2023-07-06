import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance';
//import * as eventManagementData from '../../../resources/content/event-management/event-management.json'
import { SupplierDetails, DocumentTemplate, SupplierAddress } from '../model/supplierDetailsModel';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import { logConstant } from '../../../common/logtracer/logConstant';
import { agreementsService } from 'main/services/agreementsService';

export const GET_AWARD_SUPPLIER_DOCUMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, projectName, agreement_id, lotId } = req.session;
  const { supplierId, doctempateId } = req.query;
  try {
    //Awards/templates
    const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`;
    const awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;

    //CAS-INFO-LOG
    LoggTracer.infoLogger(awardsTemplatesData, logConstant.getAwardTemplateDetails, req);

    if (supplierId !== undefined && supplierId != null && doctempateId !== undefined && doctempateId !== null) {
      const FileDownloadURL = `/tenders/projects/${projectId}/events/${eventId}/awards/templates/` + doctempateId;
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });

      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;

      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    } else {
      res.locals.agreement_header = req.session.agreement_header;
      let showallDownload = false;
      const supplierDetailsList: SupplierDetails[] = [];
      const supplierDetails = {} as SupplierDetails;

      //Supplier of interest
      const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
      const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);

      //CAS-INFO-LOG
      LoggTracer.infoLogger(supplierdata, logConstant.getSupplierResponse, req);

      const supplierDataList = (await agreementsService.api.getAgreementLotSuppliers(agreement_id, lotId)).unwrap();

      const documentTemplateDataList: DocumentTemplate[] = [];
      const documentTemplateData = {} as DocumentTemplate;
      for (let i = 0; i < awardsTemplatesData.length; i++) {
        const obj = {} as DocumentTemplate;
        const selectedSupplierData = supplierdata.data.responders.filter((x: any) => {
          if (x.supplier.id === supplierId) return x;
        });
        obj.supplierName =
          selectedSupplierData != undefined && selectedSupplierData != null
            ? selectedSupplierData[0].supplier.name
            : null;
        obj.supplierId =
          selectedSupplierData != undefined && selectedSupplierData != null
            ? selectedSupplierData[0].supplier.id
            : null;
        obj.templateId = awardsTemplatesData[i].id;
        obj.templatesFileName = awardsTemplatesData[i].fileName;
        obj.templatesFileSize = awardsTemplatesData[i].fileSize;
        obj.templatesDescription = awardsTemplatesData[i].description;
        documentTemplateData.supplierName = obj.supplierName;
        documentTemplateData.supplierId = obj.supplierId;
        if (awardsTemplatesData[i].description.includes('UnSuccessful')) {
          documentTemplateData.documentTemplatesUnSuccess = awardsTemplatesData[i].id;
        }
        if (awardsTemplatesData[i].description.includes('Awarded Templates')) {
          documentTemplateData.documentTemplates = awardsTemplatesData[i].id;
        }
        if (awardsTemplatesData[i].description.includes('Order')) {
          documentTemplateData.templatesOrder = awardsTemplatesData[i].id;
        }
      }
      documentTemplateDataList.push(documentTemplateData);
      //Supplier score
      const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
      const supplierScore =
        awardsTemplatesData != null ? await TenderApi.Instance(SESSION_ID).get(supplierScoreURL) : null;

      //CAS-INFO-LOG
      LoggTracer.infoLogger(supplierScore, logConstant.getSupplierScore, req);

      let supplierList = supplierdata.data.responders;
      console.log('log200', supplierList.length);
      supplierList = supplierList.sort((a: any, b: any) =>
        a.supplier.name.replace('-', ' ').toLowerCase() < b.supplier.name.replace('-', ' ').toLowerCase()
          ? -1
          : a.supplier.name.replace('-', ' ').toLowerCase() > b.supplier.name.replace('-', ' ').toLowerCase()
            ? 1
            : 0
      );

      // let sId = 0;
      for (let i = 0; i < supplierList.length; i++) {
        const id = supplierList[i].supplier.id;
        const score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score;
        if (supplierList[i].responseState == 'Submitted') {
          showallDownload = true;
          // sId = id;
        }

        if (supplierList[i].supplier.id != supplierId && supplierList[i].responseState == 'Submitted') {
          const supplierDetailsObj = {} as SupplierDetails;

          const supplierFiltedData = supplierDataList.filter((a: any) => {
            return a.organization.id == id;
          });

          supplierDetailsObj.supplierName = supplierList[i]?.supplier?.name;
          supplierDetailsObj.responseState = supplierList[i]?.responseState;
          supplierDetailsObj.responseDate = supplierList[i]?.responseDate;
          supplierDetailsObj.score = score != undefined ? score : 0;
          supplierDetailsObj.supplierAddress = {} as SupplierAddress; // supplierFiltedData != null ? supplierFiltedData.address : "";
          supplierDetailsObj.supplierAddress =
            supplierFiltedData != undefined && supplierFiltedData != null && supplierFiltedData.length > 0
              ? supplierFiltedData[0].address
              : ({} as SupplierAddress);
          supplierDetailsObj.supplierContactName =
            supplierFiltedData != undefined && supplierFiltedData != null && supplierFiltedData.length > 0
              ? supplierFiltedData[0].organization.contactPoint?.name
              : '';
          supplierDetailsObj.supplierContactEmail =
            supplierFiltedData != undefined && supplierFiltedData != null && supplierFiltedData.length > 0
              ? supplierFiltedData[0].organization.contactPoint?.email
              : '';
          supplierDetailsObj.supplierWebsite =
            supplierFiltedData != undefined && supplierFiltedData != null && supplierFiltedData.length > 0
              ? supplierFiltedData[0].organization.identifier?.uri
              : '';

          supplierDetailsObj.supplierId = id;
          supplierDetailsList.push(supplierDetailsObj);
        }
        //supplierDetailsList.push(dataPrepared);
      }

      //SELECTED EVENT DETAILS FILTER FORM LIST
      const baseurl = `/tenders/projects/${projectId}/events`;
      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl);
      //status=apidata.data[0].dashboardStatus;
      const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
      const agreementId = req.session.agreement_id;
      const status = selectedEventData[0].dashboardStatus;
      let orderTemplateUrl = '';
      if (agreement_id == 'RM1043.8') {
        orderTemplateUrl = 'https://www.crowncommercial.gov.uk/agreements/RM1043.8';
      } else if (agreement_id == 'RM1557.13') {
        orderTemplateUrl = 'https://www.crowncommercial.gov.uk/agreements/RM1557.13';
      } else {
        orderTemplateUrl = 'https://www.crowncommercial.gov.uk/agreements/RM6187';
      }

      //Final Object
      const eventManagementData = {
        projectId,
        eventId,
        projectName,
        status,
        supplierDetails,
        showallDownload,
        documentTemplateDataList,
        supplierDetailsList,
      };
      const appendData = { eventManagementData, projectName, agreementId, orderTemplateUrl };

      //CAS-INFO-LOG
      LoggTracer.infoLogger(null, logConstant.awardDocuments, req);

      res.render('awardDocumentComplete', appendData);
    }
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Award Document - Tenders Service Api cannot be connected',
      true
    );
  }
};
