export async function gCloudServiceQueryReplace(reqUrl: any, replaceText: any): Promise<any> {
  if (reqUrl && reqUrl !== undefined) {
    const url = reqUrl.split('&');
    const outQueryUrl: any = [];
    url.forEach((urls: any) => {
      outQueryUrl.push(urls.replace(replaceText, ''));
    });
    return outQueryUrl.join('&');
  } else {
    return reqUrl;
  }
}
