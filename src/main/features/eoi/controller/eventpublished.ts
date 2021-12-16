import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoieventPublished.json';

//@GET /rfi/event-sent
export const GET_EVENT_PUBLISHED = (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
        projPersistID: req.session['project_name'],
        rfi_ref_no: req.session.eventId
    }
    const agreementName = req.session.agreementName;
    const lotid = req.session?.lotId;
    const project_name = req.session.project_name;
    const agreementId_session = req.session.agreement_id;
    const agreementLotName = req.session.agreementLotName;
    res.locals.agreement_header = { agreementName, project_name, agreementId_session, agreementLotName, lotid };
    res.render('eventPublishedEoi.njk', appendData)
}
