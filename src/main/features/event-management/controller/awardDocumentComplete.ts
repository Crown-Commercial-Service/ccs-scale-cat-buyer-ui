import * as express from 'express'
//import { LoggTracer } from '@common/logtracer/tracer'

import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'

export const GET_AWARD_SUPPLIER_DOCUMENT = async (req: express.Request, res: express.Response) => {
        const { SESSION_ID } = req.cookies;
        const {projectId,eventId,projectName,agreement_header} =req.session

        //Supplier of interest
    const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
    const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
    let supplierName = [];
    for (let i = 0; i < supplierdata.data.responders.length; i++) {
        let dataPrepared = {
  
          "id": supplierdata.data.responders[i].supplier.id,
  
          "name": supplierdata.data.responders[i].supplier.name,
  
          "responseState": supplierdata.data.responders[i].responseState,
          "responseDate": supplierdata.data.responders[i].responseDate
  
        }
        if (supplierdata.data.responders[i].responseState == 'Submitted') {
          //showallDownload = true;
        }
        supplierName.push(dataPrepared)
      }
      //SELECTED EVENT DETAILS FILTER FORM LIST
    const baseurl = `/tenders/projects/${projectId}/events`
    const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
    const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
   const status = selectedEventData[0].dashboardStatus

        const appendData = { data: eventManagementData,supplierName,projectName,status,agreement_header}

       res.render('awardDocumentComplete',appendData)
}