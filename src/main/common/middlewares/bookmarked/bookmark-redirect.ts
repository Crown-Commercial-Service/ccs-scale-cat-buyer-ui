
import  * as express from 'express'

export class BookMarkMiddleware {

    static BookMarkStorer : express.Handler =  (req: express.Request, res: express.Response, next: express.NextFunction) => {
                    const {isAuthenticated} = req.session;
                    if(isAuthenticated === undefined){
                        const {originalUrl} = req;
                        req.session.bookmarkURL = {
                            URL: originalUrl
                        }
                        next();
                    }
                    else{
                       next();                        
                    }
    }

    static BookMarkRedirect : express.Handler =  (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const {bookmarkURL} = req.session;
        if(bookmarkURL !== undefined){
                  const redirectURL = bookmarkURL.URL;
                    if(bookmarkURL.URL !== ""){
                        req.session.bookmarkURL = {
                            URL : ""
                        }
                        res.redirect(redirectURL);
                    }
                    else{
                        next();
                    }      
    }
    else{
        next();
    }
}

}