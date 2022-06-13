//import { AgreementAPI } from '../../common/util/fetch/agreementservice/agreementsApiInstance';
import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import express from 'express';

export const CAGetRequirementDetails = async (req: express.Request) => {
    const { SESSION_ID } = req.cookies;
    const assessmentId = req.session.currentEvent.assessmentId;
    let finalData = [];
    try {

        const ASSESSTMENT_BASEURL = `/assessments/${assessmentId}`;

        const ALL_ASSESSTMENTS = await TenderApi.Instance(SESSION_ID).get(ASSESSTMENT_BASEURL);

        const ALL_ASSESSTMENTS_DATA = ALL_ASSESSTMENTS.data;

        const EXTERNAL_ID = ALL_ASSESSTMENTS_DATA['external-tool-id'];



        const CAPACITY_BASEURL = `assessments/tools/${EXTERNAL_ID}/dimensions`;

        const CAPACITY_DATA = await TenderApi.Instance(SESSION_ID).get(CAPACITY_BASEURL);

        let CAPACITY_DATASET = CAPACITY_DATA.data;



        let data;


        
        let { dimensionRequirements } = ALL_ASSESSTMENTS_DATA;
        if (dimensionRequirements.length > 0) {
            let dataObj;
            let dimensionSecurityClearance: any = [], dimensionResourceQuantity: any = []//,dimensionResourceQuantities:any=[];
            let resQuantityOption = CAPACITY_DATASET.filter((c: any) => c["dimension-id"] == 1)[0].options;
            dimensionResourceQuantity = dimensionRequirements.filter((item: any) => item["dimension-id"] == 1);
            dimensionResourceQuantity[0].requirements.forEach((element: any) => {
                let reqGroup = resQuantityOption.find((e: any) => e.name == element.name)?.groups?.[0];
                if (reqGroup != undefined) {
                    dataObj = { "Dimension": dimensionResourceQuantity[0].name, "Requirement Group": reqGroup.name, "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": dimensionResourceQuantity[0].weighting }
                }
                else {
                    dataObj = { "Dimension": dimensionResourceQuantity[0].name, "Requirement Group": "", "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": dimensionResourceQuantity[0].weighting }
                }

                finalData.push(dataObj);
            });

            dimensionSecurityClearance = dimensionRequirements.filter((item: any) => item["dimension-id"] == 2);
            dimensionSecurityClearance[0].requirements.forEach((element: any) => {
                dataObj = { "Dimension": dimensionSecurityClearance[0].name, "Requirement Group": dimensionSecurityClearance[0].name, "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": dimensionSecurityClearance[0].weighting }
                finalData.push(dataObj);
            });

            let serviceCapOption = CAPACITY_DATASET.filter((c: any) => c["dimension-id"] == 3)[0].options;

            let serviceCap = dimensionRequirements?.filter((dimension: any) => dimension["dimension-id"] === 3)[0]
            serviceCap.requirements.forEach((element: any) => {
                let reqGroup = serviceCapOption.find((e: any) => e.name == element.name)?.groups?.[0];
                if (reqGroup != undefined) {
                    dataObj = { "Dimension": serviceCap.name, "Requirement Group": reqGroup.name, "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": serviceCap.weighting }
                }
                else {
                    dataObj = { "Dimension": serviceCap.name, "Requirement Group": "", "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": serviceCap.weighting }
                }
                finalData.push(dataObj);
            });


            data = dimensionRequirements.filter((x: any) => x["dimension-id"] === 4);

            dataObj = { "Dimension": data[0].name, "Requirement Group": "", "Requirement": data[0].requirements[0].name, "Quantity": data[0].requirements[0].weighting, "Relative Weighting": data[0].weighting }
            finalData.push(dataObj);

            let locationData = dimensionRequirements?.filter((dimension: any) => dimension["dimension-id"] === 5)[0]
            if (locationData != undefined) {
                locationData.requirements.forEach((element: any) => {
                    dataObj = { "Dimension": locationData.name, "Requirement Group": "", "Requirement": element.name, "Quantity": element.weighting, "Relative Weighting": locationData.weighting }
                    finalData.push(dataObj);
                });

            }

        }
        if(finalData.length==0){
            let dataObj = { "Dimension": "", "Requirement Group": "", "Requirement":"", "Quantity": "", "Relative Weighting":"" }
            finalData.push(dataObj);
        }

        return finalData;

    } catch (err) { }
};


