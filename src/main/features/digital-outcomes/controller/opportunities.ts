import * as express from 'express';

export const GET_OPPORTUNITIES = async (req: express.Request, res: express.Response) => {
     try {
            res.render('opportunities');

        } catch (error) {
        
        }
};
export const GET_OPPORTUNITIES_DETAILS = async (req: express.Request, res: express.Response) => {
    try {

          console.log(req.params.id);
           res.render('opportunitiesReview');

       } catch (error) {
       
       }
};

