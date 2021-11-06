import * as express from 'express'
export const GET_LEAD_PROCUREMENT = async (req : express.Request, res : express.Response)=> {    
    res.render('procurementlead');
}