//@ts-nocheck
import * as express from 'express'
import * as cmsData from '../../../resources/content/RFI/nameYourProject.json';
import procurementDetail from '../model/procurementDetail'
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance'
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { HttpStatusCode } from '../../../errors/httpStatusCodes';




export const GET_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
    const { isEmptyProjectError } = req.session;
    req.session['isEmptyProjectError'] = false;
    const procurements = req.session.procurements;
    const lotId = req.session.lotId;
    const procurement: procurementDetail = procurements.find((proc: any) => proc.defaultName.components.lotId === lotId);
    const project_name = req.session.project_name;
    const agreementLotName = req.session.agreementLotName;
    const viewData: any = {
        data: cmsData,
        procId: procurement.procurementID,
        projectLongName: project_name,
        lotId,
        agreementLotName,
        error: isEmptyProjectError
    };

    res.render('nameAProject', viewData);
}

export const POST_NAME_PROJECT = async (req: express.Request, res: express.Response) => {
    const { SESSION_ID } = req.cookies; //jwt
    const { procid } = req.query;
    const name = req.body['rfi_projLongName'];
    const nameUpdateUrl = `tenders/projects/${procid}/name`;
    try {
        if (name) {
            const _body = {
                "name": name,
            }
            const response = await TenderApi.Instance(SESSION_ID).put(nameUpdateUrl, _body);
            if (response.status == HttpStatusCode.OK)
                req.session.project_name = name;
            res.redirect('/rfi/procurement-lead');
        } else {
            req.session['isEmptyProjectError'] = true;
            res.redirect('/rfi/name-your-project');
        }
    }
    catch (error) {
        LoggTracer.errorLogger(res, error, `${req.headers.host}${req.originalUrl}`, null,
            TokenDecoder.decoder(SESSION_ID), "Tender Api - getting users from organization or from tenders failed", true)
    }
}
