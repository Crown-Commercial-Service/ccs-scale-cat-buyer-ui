import * as express from 'express'
import * as eventManagementData from '../../../resources/content/event-management/event-management.json'

/**
 * 
 * @Rediect 
 * @endpoint /event/management
 * @param req 
 * @param res 
 */
export const EVENT_MANAGEMENT = (req: express.Request, res: express.Response) => {
  const appendData = { data: eventManagementData }
  res.render('eventManagement', appendData);
}