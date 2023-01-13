import url from 'node:url';

const tune = (obj: any) => {
    let emptyArr = [];
    for (const key in obj) { if(typeof(obj[key]) == 'object') { let newArr = obj[key]; for(let i = 0; i < newArr.length; i++) { emptyArr.push({'key': key, 'value': newArr[i]}); } } else { emptyArr.push({'key': key, 'value': obj[key]}); } }
    return emptyArr;
}

export async function gCloudServiceQueryResults(reqUrl: any, baseUrl: any, type: any): Promise<any> {
    var url_parts = url.parse(reqUrl, true);
    let queryObj: any = url_parts.query;
    queryObj = tune(queryObj);
    let outQueryUrl = "";
    queryObj.forEach((el: any, i: any) => {
        let key = el.key;
        let value = el.value;
        if(key=='q'){
            value = encodeURIComponent(value); 
        }
        if(i == 0) {
            if(key != '') {
                outQueryUrl += `?${key}=${value}`;
            }
        } else {
            outQueryUrl += `&${key}=${value}`;
        }
        if(i == queryObj.length - 1) {}
    });

    const params = new URLSearchParams(outQueryUrl);
    if(type==1){
        params.delete('filter_parentCategory');
    }
    if(type==2){
        params.delete('page');
    }
    const queryString = params.toString();
    const path = `${queryString ? `?${queryString}` : ''}`;
    return path;

}



