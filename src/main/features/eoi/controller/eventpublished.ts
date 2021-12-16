import * as express from 'express';
import * as cmsData from '../../../resources/content/eoi/eoievent-published.json';

//@GET /eoi/event-sent
export const GET_EVENT_PUBLISHED  = (req: express.Request, res: express.Response) => {
    const appendData = {
        data: cmsData,
        projPersistID: req.session['project_name'],
        rfi_ref_no : req.session.eventId
    }
res.render('event-published-eoi.njk', appendData)

}