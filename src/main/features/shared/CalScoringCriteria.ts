//@ts-nocheck
import express from 'express';
// import { TenderApi } from '../../common/util/fetch/procurementService/TenderApiInstance';
import { DynamicFrameworkInstance } from '../requirements/util/fetch/dyanmicframeworkInstance';

export const CalScoringCriteria = async (req: express.Request) => {
    const { SESSION_ID } = req.cookies;
    const { lotId, agreementLotName, agreementName, eventId, projectId, agreement_id, releatedContent, project_name } =
      req.session;
    const lotid = req.session?.lotId;
    const agreementId_session = agreement_id;
    
    try {
      // let tier = 0;
      // if (req.query.id) tier = req.query.id;
      // await TenderApi.Instance(SESSION_ID).put(`journeys/${proc_id}/steps/70`, 'In progress');
      // const windowAppendData = {
      //   data: scoringData,
      //   tier: tier,
      //   lotId,
      //   agreementLotName,
      //   releatedContent,
      // };
      let group_id = 'Group 8';
      let criterion_Id = 'Criterion 2';
      const baseURL: any = `/tenders/projects/${projectId}/events/${eventId}/criteria/${criterion_Id}/groups/${group_id}/questions`;
      const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      let fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const headingBaseURL: any = `/tenders/projects/${projectId}/events/${eventId}/criteria/${criterion_Id}/groups`;
      const heading_fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(headingBaseURL);
  
      fetch_dynamic_api_data = fetch_dynamic_api_data.sort((n1, n2) => n1.nonOCDS.order - n2.nonOCDS.order);
      
      fetch_dynamic_api_data = fetch_dynamic_api_data.map(item => {
        const newItem = item;
        if (item.nonOCDS.dependency == undefined) {
          newItem.nonOCDS.dependant = false;
          newItem.nonOCDS.childern = [];
        } else {
          newItem.nonOCDS.dependant = true;
          newItem.nonOCDS.childern = [];
        }
        return newItem;
      });
  
      let TemporaryObjStorage = [];
      for (const ITEM of fetch_dynamic_api_data) {
        if (ITEM.nonOCDS.dependant && ITEM.nonOCDS.dependency.relationships) {
          const RelationsShip = ITEM.nonOCDS.dependency.relationships;
          for (const Relation of RelationsShip) {
            const { dependentOnId } = Relation;
            const findElementInData = fetch_dynamic_api_data.filter(item => item.OCDS.id === dependentOnId)[0];
            findElementInData.nonOCDS.childern = [...findElementInData.nonOCDS.childern, ITEM];
            TemporaryObjStorage.push(findElementInData);
          }
        } else {
          TemporaryObjStorage.push(ITEM);
        }
      }
      const POSITIONEDELEMENTS = [...new Set(TemporaryObjStorage.map(JSON.stringify))]
        .map(JSON.parse)
        .filter(item => !item.nonOCDS.dependant);
  
      
      if (group_id === 'Group 8' && criterion_Id === 'Criterion 2') {
        TemporaryObjStorage.forEach(x => {
          //x.nonOCDS.childern=[];
          if (x.nonOCDS.questionType === 'Table') {
            x.nonOCDS.options.forEach(element => {
              element.optiontableDefination = mapTableDefinationData(element);
              element.optiontableDefinationJsonString = JSON.stringify(mapTableDefinationData(element));
            });
          }
        });
        TemporaryObjStorage = TemporaryObjStorage.slice(0, 2);
      }
      return TemporaryObjStorage;
    }
    catch(error){ return [];}
    };

    const mapTableDefinationData = (tableData) => {
        let object = null;
        var columnsHeaderList = getColumnsHeaderList(tableData.tableDefinition?.titles?.columns);
        //var rowDataList
        var tableDefination = tableData.tableDefinition != undefined && tableData.tableDefinition.data != undefined ? getRowDataList(tableData.tableDefinition?.titles?.rows, tableData.tableDefinition?.data) : null
      
        return { head: columnsHeaderList?.length > 0 && tableDefination?.length > 0 ? columnsHeaderList : [], rows: tableDefination?.length > 0 ? tableDefination : [] };
      }
      
      const getColumnsHeaderList = (columns) => {
        const list = columns?.map(element => {
          return { text: element.name };
        });
        return list
      }
      const getRowDataList = (rows, data1) => {
        let dataRowsList = [];
        rows?.forEach(element => {
          element.text = element.name;
          var data = getDataList(element.id, data1);
          let innerArrObj = [{ text: element.name, "classes": "govuk-!-width-one-quarter" }, { "classes": "govuk-!-width-one-quarter", text: data[0].cols[0] }, { "classes": "govuk-!-width-one-half", text: data[0].cols[1] }]
          dataRowsList.push(innerArrObj);
        });
        return dataRowsList;
      }
      const getDataList = (id, data) => {
        const obj = data?.filter(element => {
          if (element.row == id) {
            return element;
          }
        });
        return obj;
      }
      