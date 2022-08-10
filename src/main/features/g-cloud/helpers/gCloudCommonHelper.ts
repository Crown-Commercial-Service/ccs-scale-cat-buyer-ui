import { GCloud_API_END_POINTS } from '../model/gCloudConstants';
import { GCloud_Supplier_API_Instance } from '../util/fetch/gCloudInstance';
//const { Logger } = require('@hmcts/nodejs-logging');
//const logger = Logger.getLogger('G-Cloud Healper');
let tokenValue1 = 'BearerToken';
export class gCloudHelper {
    
    static getFiltersData = async (lotNameList: string[]) => {
        var filterData = await (await GCloud_Supplier_API_Instance.Instance(tokenValue1).get(GCloud_API_END_POINTS.G_CLOUD_SUPPLIER_API))?.data;
        let newFiltedList: any[] = [];
        if (filterData.length > 0) {
            for (let index = 0; index < filterData.length; index++) {
                lotNameList.forEach(x => {
                    if (filterData[index].key.toLowerCase().trim() === x.toLowerCase().trim()) {
                        newFiltedList.push(filterData[index]);
                    }
                });
            }
        }
        return newFiltedList;
    }
}