import * as express from 'express';

const RequestSecurity = (app: express.Express): void => {
    const AllowedMethods = [
        "OPTIONS",
        "HEAD",
        "CONNECT",
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
      ];

          app.use((req, res, next) => {
            if (!AllowedMethods.includes(req.method)) {
                res.status(405).send(`${req.method} not allowed.`);
              }
            else{
                next();
            }  
                          
          });


}


export { RequestSecurity }