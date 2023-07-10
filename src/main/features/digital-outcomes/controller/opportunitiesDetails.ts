import * as express from 'express';
import { TenderApi } from '../../../common/util/fetch/tenderService/tenderApiInstance';

import moment from 'moment-business-days';
import { DynamicFrameworkInstance } from 'main/features/event-management/util/fetch/dyanmicframeworkInstance';

export const GET_OPPORTUNITIES_DETAILS_REVIE_RECOMMENDATION = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, status, subStatus, lot } = req.query;

    //const eventTypeURL = 'https://dev-ccs-scale-cat-service.london.cloudapps.digital/tenders/projects/21737';
    //let projectIds = '22111';
    //let projectIds = '21737';

    const eventTypeURL = `/tenders/projects/${projectId}`;

    let getOppertunitiesData = await TenderApi.InstanceSupplierQA().get(eventTypeURL);
    let getOppertunities = getOppertunitiesData?.data;
    let ocid = getOppertunities.records[0].compiledRelease.ocid;

    let awards: any = '';
    let awardDate = '';
    let part;
    let award_matched_selector = [];
    if (getOppertunities.records[0].compiledRelease?.awards) {
      awards = getOppertunities.records[0].compiledRelease?.awards[0];
      awardDate = moment(getOppertunities.records[0].compiledRelease?.awards[0]?.date).format('DD/MM/YYYY');

      const identifierField: (string | number)[] = [];
      let identifierscheme = awards.suppliers[0]?.identifier?.scheme.replace('XI', 'US');
      let identifierschemeId = awards.suppliers[0].identifier.id;
      let sidentifierField = identifierscheme + '-' + identifierschemeId;
      identifierField.push(sidentifierField);

      awards.suppliers[0]?.additionalIdentifiers.map((additionalIdenti: any) => {
        if (additionalIdenti.scheme) {
          let additionalidentifierscheme = additionalIdenti.scheme.replace('XI', 'US');
          let aaditionalidentifierschemeId = additionalIdenti.id;
          let additioanlsidentifierField = additionalidentifierscheme + '-' + aaditionalidentifierschemeId;
          identifierField.push(additioanlsidentifierField);
        }
      });

      part = getOppertunities.records[0].compiledRelease.parties;
      //GB-COH-02299747
      award_matched_selector = part?.filter((agroupitem: any) => {
        return identifierField.includes(agroupitem?.id); // true
      });

      award_matched_selector = award_matched_selector[0];
    }

    let bids = getOppertunities.records[0].compiledRelease.bids;

    let supplierSummeryCount = bids.map((item: any) => {
      let result: any[] = [];
      //   const newItem = item;
      item.statistics.map((sta: any) => {
        let measure = sta.measure;
        let value = sta.value;
        result[measure] = value;
      });
      return result;
    });

    const display_fetch_data = {
      buyer: getOppertunities.records[0].compiledRelease.buyer,
      tenderer: getOppertunities.records[0].compiledRelease.tender,
      tenderers: getOppertunities.records[0].compiledRelease.tender.tenderers,
      //parties: getOppertunities.records[0].compiledRelease.parties[0],
      parties: award_matched_selector,

      awards: awards,
      awardDate: awardDate,
      //endDate: moment(getOppertunities.records[0].compiledRelease.tenderPeriod.endDate).format('dddd DD MMMM YYYY'),
      endDate: moment(getOppertunities.records[0].compiledRelease.tender.tenderPeriod.endDate).format(
        'dddd DD MMMM YYYY'
      ),
      supplierSummeryCount: supplierSummeryCount,
      suppliersResponded: supplierSummeryCount[0]['suppliersResponded'],
      suppliersNotResponded: supplierSummeryCount[0]['suppliersNotResponded'],
      ocid: ocid,
      projectId: projectId,
      status: status,
      subStatus: subStatus,
      currentLot: lot,
    };

    res.render('opportunitiesDetails', display_fetch_data);
  } catch (error) {}
};

export const OPPORTUNITY_DETAILS_DOWNLOAD = async (req: express.Request, res: express.Response) => {
  //const { SESSION_ID } = req.cookies; //jwt
  const { prId, id, download } = req.query;

  try {
    if (download != undefined) {
      const FileDownloadURL = `/tenders/projects/${prId}/events/${id}/documents/export`;
      // const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance(SESSION_ID).get(FileDownloadURL, {
      //   responseType: 'arraybuffer',
      // });
      const FetchDocuments = await DynamicFrameworkInstance.file_dowload_Instance_Public().get(FileDownloadURL, {
        responseType: 'arraybuffer',
      });

      const file = FetchDocuments;
      const fileName = file.headers['content-disposition'].split('filename=')[1].split('"').join('');
      const fileData = file.data;
      const type = file.headers['content-type'];
      const ContentLength = file.headers['content-length'];
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': type,
        'Content-Length': ContentLength,
        'Content-Disposition': 'attachment; filename=' + fileName,
      });
      res.send(fileData);
    }
  } catch (error) {
    console.log('Opportunities download', error);
  }
};
