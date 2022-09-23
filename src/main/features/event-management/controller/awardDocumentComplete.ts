import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { GetLotSuppliers } from '../../shared/supplierService';
import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
//import * as eventManagementData from '../../../resources/content/event-management/event-management.json'
import { SupplierDetails, DocumentTemplate } from '../model/supplierDetailsModel';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';

export const GET_AWARD_SUPPLIER_DOCUMENT = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId, projectName } = req.session
  const { supplierId, doctempateId } = req.query;

  try {
    //Awards/templates
    const awardsTemplatesURL = `tenders/projects/${projectId}/events/${eventId}/awards/templates`
    const awardsTemplatesData = await (await TenderApi.Instance(SESSION_ID).get(awardsTemplatesURL))?.data;
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
      let supplierDetailsList: SupplierDetails[] = [];
      let supplierDetails = {} as SupplierDetails;

      //Supplier of interest
      const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
      const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)

      const submittedSupplierData = supplierdata?.data?.responders?.filter((res :any) => res.responseState.toLowerCase() == "submitted");

      let supplierDataList = [];
      supplierDataList = await GetLotSuppliers(req);

      let documentTemplateDataList: DocumentTemplate[] = [];
      let documentTemplateData = {} as DocumentTemplate;
      for (let i = 0; i < awardsTemplatesData.length; i++) {
        let obj = {} as DocumentTemplate;
        let selectedSupplierData = supplierdata.data.responders.filter((x: any) => {
          if (x.supplier.id === supplierId) return x;
        });
       // obj.supplierName = selectedSupplierData != undefined && selectedSupplierData != null ? selectedSupplierData[0].supplier.name : null
        obj.supplierId = selectedSupplierData != undefined && selectedSupplierData != null ? selectedSupplierData[0].supplier.id : null;
        obj.supplierName = supplierDataList?.filter((a: any) => (a.organization.id ==  obj.supplierId))?.[0]?.organization?.name;
        obj.templateId = awardsTemplatesData[i].id;
        obj.templatesFileName = awardsTemplatesData[i].fileName;
        obj.templatesFileSize = awardsTemplatesData[i].fileSize;
        obj.templatesDescription = awardsTemplatesData[i].description;
        documentTemplateData.supplierName = obj.supplierName;
        documentTemplateData.supplierId = obj.supplierId;
        if (awardsTemplatesData[i].description.includes("UnSuccessful")) {
          documentTemplateData.documentTemplatesUnSuccess = awardsTemplatesData[i].id;
        }
        if (awardsTemplatesData[i].description.includes("Awarded Templates")) {
          documentTemplateData.documentTemplates = awardsTemplatesData[i].id;
        }
        if (awardsTemplatesData[i].description.includes("Order")) {
          documentTemplateData.templatesOrder = awardsTemplatesData[i].id;
        }
      }
      documentTemplateDataList.push(documentTemplateData);
      //Supplier score
      const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`
      const supplierScore = awardsTemplatesData != null ? await TenderApi.Instance(SESSION_ID).get(supplierScoreURL) : null

      for (let i = 0; i < submittedSupplierData?.length; i++) {
        let id = submittedSupplierData[i].supplier.id;
        let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)[0]?.score;

        if (id != supplierId) {
          let supplierDetailsObj = {} as SupplierDetails;
          //var supplierFiltedData = supplierDataList.filter((a: any) => { a.organization.id == id });
          //supplierDetailsObj.supplierName = submittedSupplierData[i].supplier.name;
          supplierDetailsObj.supplierName = supplierDataList?.filter((a: any) => (a.organization.id == id))?.[0]?.organization?.name;
          supplierDetailsObj.responseState = submittedSupplierData[i].responseState;
          supplierDetailsObj.responseDate = submittedSupplierData[i].responseDate;
          supplierDetailsObj.score = (score != undefined) ? score : 0;

          supplierDetailsObj.supplierId = id;
          supplierDetailsList.push(supplierDetailsObj);
        }
        //supplierDetailsList.push(dataPrepared);
      }

      const unsuccessfulSupplierId = supplierDetailsList[0]?.supplierId;

      if (unsuccessfulSupplierId != undefined && unsuccessfulSupplierId != null) {
        const baseSuuplierURL = `/tenders/projects/${projectId}/events/${eventId}/suppliers/${unsuccessfulSupplierId}`;
        const supplierResponse = await TenderApi.Instance(SESSION_ID).get(baseSuuplierURL);

        const supplierData = supplierResponse?.data;

        supplierDetailsList[0].supplierContactEmail = supplierData?.contactPoint?.email;
      }

      //SELECTED EVENT DETAILS FILTER FORM LIST
      const baseurl = `/tenders/projects/${projectId}/events`
      const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
      //status=apidata.data[0].dashboardStatus;
      const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
      let status = selectedEventData[0].dashboardStatus


      for (let index = 0; index < supplierDetailsList.length; index++) {
        let contactEmail = supplierDataList?.filter((a: any) => a.organization.id == supplierDetailsList[index].supplierId)?.[0]?.organization?.contactPoint?.email;

        if (contactEmail != undefined && contactEmail != null)
          supplierDetailsList[index].supplierContactEmail = contactEmail;
        else
          supplierDetailsList[index].supplierContactEmail = "NA"

      }
      
      supplierDetailsList.sort(function(a, b){
        let firstElement = a.supplierName.toLocaleLowerCase();
        let secondElement = b.supplierName.toLocaleLowerCase();
        if(firstElement < secondElement) { return -1; }
        if(firstElement > secondElement) { return 1; }
        return 0;
    })
      //Final Object
      let eventManagementData = {
        projectId,
        eventId,
        projectName,
        status,
        supplierDetails,
        documentTemplateDataList,
        supplierDetailsList
      };
      const appendData = { eventManagementData, projectName, supplierId };
      res.render('awardDocumentComplete', appendData)
    }

  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Tenders Service Api cannot be connected',
      true,
    );
  }

}