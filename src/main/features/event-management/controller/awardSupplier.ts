import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { AgreementAPI } from '../../../common/util/fetch/agreementservice/agreementsApiInstance';
import { SupplierDetails } from '../model/supplierDetailsModel';
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
export const GET_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { supplierId } = req.query;

    const { projectId, eventId, projectName, agreement_header, agreement_id, lotId } = req.session;
    try {
        //Supplier of interest
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
        const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
        let supplierDetailsList: SupplierDetails[] = [];
        let supplierDetails = {} as SupplierDetails;
        let viewError = false;
        //agreements/{agreement-id}/lots/{lot-id}/suppliers
        const baseurl_Supplier = `agreements/${agreement_id}/lots/${lotId}/suppliers`
        const supplierDataList = await (await AgreementAPI.Instance.get(baseurl_Supplier))?.data;
        //Supplier score
        const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
        const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

        for (let i = 0; i < supplierdata.data.responders.length; i++) {
            let id = supplierdata.data.responders[i].supplier.id;
            let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)?.[0]?.score;


            if (supplierdata.data.responders[i].responseState == 'Submitted') {
                //showallDownload = true;
            }
            if (supplierdata.data.responders[i].supplier.id == supplierId) {
                // let supplierData = supplierDataList.filter((x: any) => x.);
                supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
                supplierDetails.responseState = supplierdata.data.responders[i].responseState;
                supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
                supplierDetails.score = (score != undefined) ? score : 0;

                supplierDetails.supplierAddress = supplierDataList != null ? "" : "";
                supplierDetails.supplierContactName = supplierDataList != null ? "" : "";
                supplierDetails.supplierContactEmail = supplierDataList != null ? "" : "";
                supplierDetails.supplierWebsite = supplierDataList != null ? "" : "";
                supplierDetails.supplierId = id;
                supplierDetailsList.push(supplierDetails);
            }
        }

        //SELECTED EVENT DETAILS FILTER FORM LIST
        const baseurl = `/tenders/projects/${projectId}/events`
        const apidata = await TenderApi.Instance(SESSION_ID).get(baseurl)
        //status=apidata.data[0].dashboardStatus;
        const selectedEventData = apidata.data.filter((d: any) => d.id == eventId);
        let status = selectedEventData[0].dashboardStatus;

        const appendData = { status, supplierDetails, supplierDetailsList, projectName, agreement_header, viewError }
        res.render('awardSupplier', appendData);
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
export const POST_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {

    const { award_supplier_confirmation, } = req.body;
    const { SESSION_ID } = req.cookies;
    //let { projectId, eventId, projectName, agreement_id, lotId } = req.session;
    const { supplierId } = req.query;
    try {
        // let viewError = false;

        if (award_supplier_confirmation != undefined && award_supplier_confirmation === '1') {
            res.redirect("/awardSupplier");
        }
        else {
            // viewError = true;
            res.redirect('award-supplier?supplierId=' + supplierId)
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