import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/nameYourProject.json';
import procurementDetail from '../model/procurementDetail'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';




export const GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
    const procurements = req.session.procurements;
    var lotId = req.session.lotId;
    let procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
    const project_name = req.session.project_name;
    const agreementLotName = req.session.agreementLotName;
    let viewData: any = {
        data: cmsData,
        procId: procurement.procurementID,
        projectLongName: project_name,
        lotId,
        agreementLotName,
    };

    res.render('nameAProject', viewData);
}

export const POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
    var { SESSION_ID } = req.cookies; //jwt
    var { procid } = req.query;
    var name = req.body['rfi_projLongName'];
    const nameUpdateUrl = `tenders/projects/${procid}/name`;
    try {
        const _body = {
            "name": name,
        }
        var response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
        if (response.status == HttpStatusCode.OK)
            req.session.project_name = name;
        res.redirect('/rfi/procurement-lead');
    }
    catch (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
            TokenDecoder.decoder(SESSION_ID), "Tender Api - getting users from organization or from tenders failed", true)
    }
}
