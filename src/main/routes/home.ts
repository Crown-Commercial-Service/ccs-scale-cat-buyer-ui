import { Application, Request, Response } from 'express';

export default function (app: Application): void {
  app.get('/', (_req: Request, res: Response) => res.redirect('/dashboard'));
}
