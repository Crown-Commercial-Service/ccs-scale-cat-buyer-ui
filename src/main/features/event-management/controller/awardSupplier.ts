import { LoggTracer } from '@common/logtracer/tracer';
import { TokenDecoder } from '@common/tokendecoder/tokendecoder';
import { AgreementAPI } from '@common/util/fetch/agreementservice/agreementsApiInstance';
import * as express from 'express'
//import { LoggTracer } from '@common/logtracer/tracer'
//import { TokenDecoder } from '@common/tokendecoder/tokendecoder'
//import { CreateMessage } from '../model/createMessage'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'

export const GET_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { projectId, eventId, projectName } = req.session
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
    const appendData = { data: eventManagementData, supplierName, projectName }
    res.render('awardSupplier', appendData)
}
export const POST_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {

    const { award_supplier_confirmation, } = req.body;
    const { SESSION_ID } = req.cookies;
    let { projectId, eventId, projectName, agreement_id, lotId } = req.session;
    const { supplierId } = req.query;
    //LOCAL VERIABLE agreement_id, lotId
    let status: string;
    try {
        res.locals.agreement_header = req.session.agreement_header;
        let supplierDetailsList = [];
        let showallDownload = false;
        let supplierDetails = {
            supplierName: "",
            supplierAddress: "",
            supplierContactName: "",
            supplierContactEmail: "",
            supplierWebsite: "",
            supplierId: ""
        };
        //Supplier of interest
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`
        const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL)
        //agreements/{agreement-id}/lots/{lot-id}/suppliers
        const baseurl_Supplier = `agreements/${agreement_id}/lots/${lotId}/suppliers`
        const supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier))?.data;


        for (let i = 0; i < supplierdata.data.responders.length; i++) {
            let dataPrepared = {
                "id": supplierdata.data.responders[i].supplier.id,
                "name": supplierdata.data.responders[i].supplier.name,
                "responseState": supplierdata.data.responders[i].responseState,
                "responseDate": supplierdata.data.responders[i].responseDate
            }
            if (supplierdata.data.responders[i].responseState == 'Submitted') {
                showallDownload = true;
            }
            if (supplierdata.data.responders[i].supplier.id == supplierId) {

                // let supplierData = supplierDataList.filter((x: any) => x.);
                supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
                supplierDetails.supplierAddress = supplierDataList != null ? "" : "";
                supplierDetails.supplierContactName = supplierDataList != null ? "" : "";
                supplierDetails.supplierContactEmail = supplierDataList != null ? "" : "";
                supplierDetails.supplierWebsite = supplierDataList != null ? "" : "";
                supplierDetails.supplierId = supplierId.toString();
                supplierDetailsList.push(dataPrepared);
            }
            //supplierDetailsList.push(dataPrepared);
        }
        if (supplierId != undefined && supplierId != null && supplierdata.data.responders != null && supplierdata.data.responders.length > 0) {
            supplierdata.data.responders.filter((x: any) => {
                if (x != null && x.supplier.id == supplierId) {
                    supplierDetails.supplierName = x.supplier.name;
                    supplierDetails.supplierAddress = supplierDataList != null ? "" : "";
                    supplierDetails.supplierContactName = supplierDataList != null ? "" : "";
                    supplierDetails.supplierContactEmail = supplierDataList != null ? "" : "";
                    supplierDetails.supplierWebsite = supplierDataList != null ? "" : "";
                    supplierDetails.supplierId = supplierId.toString();
                }
            })
        }

        //SELECTED EVENT DETAILS FILTER FORM LIST
        const baseurl = `/tenders/projects/${projectId}/events`
        const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
        //status=apidata.data[0].dashboardStatus;
        const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
        status = selectedEventData[0].dashboardStatus


        //Final Object
        let eventManagementData = {
            projectId,
            eventId,
            projectName,
            status,
            supplierDetails,
            showallDownload,
        };
        const appendData = { eventManagementData, supplierDetailsList, data: "date" }

        if (award_supplier_confirmation === '1') {
            res.redirect("/awardSupplier");
        }
        else {

            res.render('awardSupplier', appendData)
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