/*
 * A quick check to verify that there is an HTTP server available, indicating
 * that the app is "up" regardless of the current state of any external
 * dependencies.
 */
import {Application, Request, Response} from 'express';

export default (app: Application): void => {
    app.get('/isAlive', (req: Request, res: Response) => res.json({isAlive: 'yes'}));
};
