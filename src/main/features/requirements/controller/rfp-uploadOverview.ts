//@ts-nocheck
import * as express from 'express';
import * as uploadData from '../../../resources/content/requirements/rfpUploadOverview.json';
import * as DosuploadData from '../../../resources/content/MCF3/requirements/rfpUploadOverviewDos.json';
import * as Mcf3uploadData from '../../../resources/content/MCF3/requirements/rfpUploadOverview.json';
import * as GClouduploadData from '../../../resources/content/requirements/rfpGCLOUDUploadOverview.json';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
/**
 *
 * @Rediect
 * @endpoint '/oauth/login
 * @param req
 * @param res
 */
export const RFP_UPLOAD = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies;
  const { projectId, eventId } = req.session;
  const releatedContent = req.session.releatedContent;
  const agreementName = req.session.agreementName;
  const lotid = req.session?.lotId;
  const project_name = req.session.project_name;
  const agreementId_session = req.session.agreement_id;
  const agreementLotName = req.session.agreementLotName;
  const { isJaggaerError } = req.session;
  const { selectedRoute } = req.session; //BALWINDER
  req.session['isJaggaerError'] = false;
  const { stage2_value } = req.session;
  res.locals.agreement_header = {
    agreementName,
    projectName: project_name,
    projectId,
    agreementIdSession: agreementId_session,
    agreementLotName,
    lotid,
  };

  const FILE_PUBLISHER_BASEURL = `/tenders/projects/${projectId}/events/${eventId}/documents`;
  const FetchDocuments = await DynamicFrameworkInstance.Instance(SESSION_ID).get(FILE_PUBLISHER_BASEURL);
  const FETCH_FILEDATA = FetchDocuments?.data;
  let uploadDatas;
  if (agreementId_session == 'RM6187') {
    //MCF3
    uploadDatas = Mcf3uploadData;
  } else if (agreementId_session == 'RM1557.13') {
    //GCloud
    uploadDatas = GClouduploadData;
  } else if (agreementId_session == 'RM1043.8') {
    //DOS
    uploadDatas = DosuploadData;
  }

  uploadDatas.taskList[0].taskStatus = 'To do';
  if (agreementId_session == 'RM1557.13') {
    //GCloud
    uploadDatas.taskList[1].taskStatus = 'To do';
  } else if (agreementId_session == 'RM1043.8') {
    //dos
    uploadDatas.taskList[1].taskStatus = 'Optional';
  } else {
    uploadDatas.taskList[1].taskStatus = 'Cannot start yet';
  }

  if (agreementId_session == 'RM1043.8') {
    //DOS
    uploadDatas.taskList[2].taskStatus = 'To do';
  } else {
    uploadDatas.taskList[2].taskStatus = 'Optional';
  }

  const uploadAddDoc = req.session['isuploadAdditionalDoc'];
  let firstupload = false;
  let secondupload = false;
  let thirdupload = false;
  FETCH_FILEDATA?.map((file) => {
    if (file.description === 'mandatoryfirst') {
      firstupload = true;
      uploadDatas.taskList[0].taskStatus = 'Done';
    }

    if (uploadDatas.taskList[1].taskStatus != 'Done' && uploadDatas.taskList[0].taskStatus === 'Done') {
      if (agreementId_session != 'RM1043.8') {
        uploadDatas.taskList[1].taskStatus = 'To do';
      }
    }

    if (file.description === 'mandatorysecond') {
      secondupload = true;
      uploadDatas.taskList[1].taskStatus = 'Done';
    }

    if (file.description === 'mandatorythird') {
      thirdupload = true;
      uploadDatas.taskList[2].taskStatus = 'Done';
    }
    if (agreementId_session == 'RM1043.8') {
      //DOS
      if (file.description === 'secondoptional') {
        uploadDatas.taskList[3].taskStatus = 'Done';
      }
    } else {
      if (file.description === 'optional') {
        uploadDatas.taskList[2].taskStatus = 'Done';
      }
    }
  });

  let forceChangeDataJson;
  if (agreementId_session == 'RM6187') {
    //MCF3
    forceChangeDataJson = uploadDatas;
  } else if (agreementId_session == 'RM1557.13') {
    //GCloud
    forceChangeDataJson = uploadDatas;
  } else if (agreementId_session == 'RM1043.8') {
    //DOS
    forceChangeDataJson = uploadDatas;
  } else {
    forceChangeDataJson = uploadData;
  }

  const appendData = { data: forceChangeDataJson, releatedContent, error: isJaggaerError, agreementId_session };
  try {
    if (agreementId_session == 'RM1043.8' && stage2_value == 'Stage 2') {
      if (firstupload != true && thirdupload != true) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/86`, 'In progress');
      } else {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/86`, 'Completed');
      }
    } else {
      if (agreementId_session == 'RM6187') {
        const flags = await ShouldEventStatusBeUpdated(eventId, 32, req);

        if (flags) {
          await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'In progress');
        }
      }

      const flag = await ShouldEventStatusBeUpdated(eventId, 30, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/30`, 'In progress');
      }
    }
    //37 changes to 30 BALWINDER
    res.render('rfp-uploadOverview', appendData);
  } catch (error) {
    LoggTracer.errorLogger(
      res,
      error,
      `${req.headers.host}${req.originalUrl}`,
      null,
      TokenDecoder.decoder(SESSION_ID),
      'Journey service - update the status failed - RFP upload overview Page',
      true
    );
  }
};
