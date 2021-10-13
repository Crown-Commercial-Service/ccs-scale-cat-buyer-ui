import { Application } from 'express';

export default function(app: Application): void {
  
  app.get('/', (req, res)=> res.send(process.env.TENDERS_SERVICE_API_URL));
}
