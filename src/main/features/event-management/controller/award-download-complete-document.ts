import * as express from 'express'
//import { LoggTracer } from '@common/logtracer/tracer'
//import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
//import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
//import * as inboxData from '../../../resources/content/event-management/messaging-create.json'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'

export const EVENT_MANAGEMENT_SUPPLIER_EVALUATION = async (req: express.Request, res: express.Response) => {
        const { SESSION_ID } = req.cookies;
        const {projectId,eventId,projectName} =req.session
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
        const appendData = { data: eventManagementData,supplierName,projectName}

       res.render('awardDocumentComplete',appendData)
}