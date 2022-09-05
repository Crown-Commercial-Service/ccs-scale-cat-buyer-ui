import * as express from 'express'
import { TenderApi } from '../../../common/util/fetch/procurementService/TenderApiInstance'
import { SupplierDetails,SupplierAddress } from '../model/supplierDetailsModel';
import { LoggTracer } from '../../../common/logtracer/tracer'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder'
import { GetLotSuppliers } from '../../shared/supplierService';

export const GET_AWARD_SUPPLIER = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies;
    const { supplierId } = req.query;

    const { projectId, eventId, projectName, agreement_header, viewError } = req.session;
    try {
        //Supplier of interest
        const supplierInterestURL = `tenders/projects/${projectId}/events/${eventId}/responses`;
        const supplierdata = await TenderApi.Instance(SESSION_ID).get(supplierInterestURL);
        let supplierDetailsList: SupplierDetails[] = [];
        let supplierDetails = {} as SupplierDetails;

        //Supplier score
        const supplierScoreURL = `tenders/projects/${projectId}/events/${eventId}/scores`;
        const supplierScore = await TenderApi.Instance(SESSION_ID).get(supplierScoreURL);

        let supplierDataList = [];
        supplierDataList = await GetLotSuppliers(req);

        for (let i = 0; i < supplierdata.data.responders.length; i++) {

            let id = supplierdata.data.responders[i].supplier.id;
            let score = supplierScore?.data?.filter((x: any) => x.organisationId == id)?.[0]?.score;

            if (supplierdata.data.responders[i].responseState == 'Submitted') {
                //showallDownload = true;
            }
            if (id == supplierId) {
                supplierDetails.supplierName = supplierFiltedData = supplierDataList?.filter((a: any) => (a.organization.id == id))?.[0]?.organization?.name;
              //  supplierDetails.supplierName = supplierdata.data.responders[i].supplier.name;
                supplierDetails.responseState = supplierdata.data.responders[i].responseState;
                supplierDetails.responseDate = supplierdata.data.responders[i].responseDate;
                supplierDetails.score = (score != undefined) ? score : 0;
                supplierDetails.supplierId = id;
                supplierDetailsList.push(supplierDetails);
            }
        }
        
        if (supplierId != undefined && supplierId != null) {
            var supplierFiltedData = supplierDataList?.filter((a: any) => a.organization.id == supplierId)[0]?.organization;
            if (supplierFiltedData != null && supplierFiltedData != undefined) {
                supplierDetails.supplierAddress = {} as SupplierAddress;
                supplierDetails.supplierAddress = supplierFiltedData.address != undefined && supplierFiltedData.address != null ? supplierFiltedData?.address : null
                supplierDetails.supplierContactName = supplierFiltedData.contactPoint != undefined && supplierFiltedData.contactPoint != null && supplierFiltedData.contactPoint?.name !=undefined && supplierFiltedData.contactPoint?.name !=null ? supplierFiltedData.contactPoint?.name : null;
                supplierDetails.supplierContactEmail = supplierFiltedData.contactPoint != undefined? supplierFiltedData.contactPoint?.email : null;
                supplierDetails.supplierWebsite = supplierFiltedData.contactPoint != undefined && supplierFiltedData.contactPoint != null ? supplierFiltedData.contactPoint?.url : null;
                }

        supplierDetails.supplierId = supplierDetails?.supplierId.substring(3);
        supplierDetails.supplierId = supplierDetails?.supplierId.replace(/-/g, " ");
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

    const { award_supplier_confirmation, supplier_id } = req.body;
    const { SESSION_ID } = req.cookies;
    try {
        if (award_supplier_confirmation != undefined && award_supplier_confirmation === '1') {
            res.redirect('/stand-period');
        }
        else {
            req.session['viewError'] = true;
            res.redirect('award-supplier?supplierId=' + supplier_id)

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