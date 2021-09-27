
import * as express from 'express'

// RFI TaskList
export const RFI_TASK_LIST = (Request : express.Request, Response: express.Response)=> {
   Response.render('partials/RFI/Tasklist')
}
