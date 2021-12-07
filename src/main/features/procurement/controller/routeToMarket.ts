//@ts-nocheck
import * as express from 'express'

/**
 * 
 * @Rediect 
 * @endpoint '/oauth/login
 * @param req 
 * @param res 
 */
export const ROUTE_TO_MARKET = (req: express.Request, res: express.Response) => {
  const eventTypes = req.session.types
  const eoiRoute = eventTypes.find((element => element == 'EOI'))
  if (eoiRoute == 'EOI') {
    req.session.selectedRoute = 'EOI'
    res.redirect('/projects/events/choose-route')
  } else {
    req.session.selectedRoute = 'RFI'
    res.redirect('/rfi/rfi-tasklist')
  }
}