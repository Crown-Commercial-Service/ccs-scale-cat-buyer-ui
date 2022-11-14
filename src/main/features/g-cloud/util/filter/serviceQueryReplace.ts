

export async function gCloudServiceQueryReplace(reqUrl: any, replaceText: any): Promise<any> {
    
    if(reqUrl && reqUrl!==undefined){
        let url=reqUrl.split('&');
        let outQueryUrl:any=[];
        url.forEach((urls:any) => {
           outQueryUrl.push(urls.replace(replaceText,''));
        });
        return outQueryUrl.join('&'); 
    }else{
        return reqUrl;

    }
     
    
}

