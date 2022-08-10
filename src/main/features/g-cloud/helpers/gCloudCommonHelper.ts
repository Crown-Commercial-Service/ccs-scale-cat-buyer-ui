import { GCloud_API_END_POINTS, TokenValue } from '../model/gCloudConstants';
import { GCloud_Supplier_API_Instance } from '../util/fetch/gCloudInstance';
//const { Logger } = require('@hmcts/nodejs-logging');
//const logger = Logger.getLogger('G-Cloud Healper');

export class gCloudHelper {
    static getFiltersData = async (lotNameList: string[]) => {
        var filterData = await (await GCloud_Supplier_API_Instance.Instance(TokenValue.G_CLOUD_TOKEN).get(GCloud_API_END_POINTS.G_CLOUD_SUPPLIER_API))?.data;
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