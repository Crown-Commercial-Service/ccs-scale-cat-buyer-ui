//@ts-nocheck
import * as express from 'express';
import { DynamicFrameworkInstance } from '../util/fetch/dyanmicframeworkInstance';
import fileData from '../../../resources/content/requirements/rfpAddContext.json';
import { operations } from '../../../utils/operations/operations';
import { ErrorView } from '../../../common/shared/error/errorView';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TenderApi } from './../../../common/util/fetch/procurementService/TenderApiInstance';
import { ShouldEventStatusBeUpdated } from '../../shared/ShouldEventStatusBeUpdated';
/**
 *
 * @param req
 * @param res
 * @GETController
 */
export const RFP_GET_ADD_CONTEXT = async (req: express.Request, res: express.Response) => {
  const { projectId,eventId } = req.session;
  if (
    operations.isUndefined(req.query, 'agreement_id') ||
    operations.isUndefined(req.query, 'proc_id') ||
    operations.isUndefined(req.query, 'event_id')
  ) {
    const RedirectURL = `/rfp/add-context?agreement_id=${req.session.agreement_id}&proc_id=${req.session.projectId}&event_id=${req.session.eventId}`;
    res.redirect(RedirectURL);
  } else {
    const { agreement_id, proc_id, event_id } = req.query;
    const { SESSION_ID } = req.cookies;
    const baseURL: any = `/tenders/projects/${proc_id}/events/${event_id}/criteria`;
    try {
      const fetch_dynamic_api = await DynamicFrameworkInstance.Instance(SESSION_ID).get(baseURL);
      const fetch_dynamic_api_data = fetch_dynamic_api?.data;
      const extracted_criterion_based = fetch_dynamic_api_data?.map((criterian: any) => criterian?.id);
      let criterianStorage: any = [];
      for (const aURI of extracted_criterion_based) {
        if (aURI.trim().toLowerCase() ==="Criterion 3".toLowerCase()) {
          const criterian_bas_url = `/tenders/projects/${proc_id}/events/${event_id}/criteria/${aURI}/groups`;
        const fetch_criterian_group_data = await DynamicFrameworkInstance.Instance(SESSION_ID).get(criterian_bas_url);
        const criterian_array = fetch_criterian_group_data?.data;
        const rebased_object_with_requirements = criterian_array?.map((anItem: any) => {
          const object = anItem;
          object['criterianId'] = aURI;
          return object;
        });
        criterianStorage.push(rebased_object_with_requirements);
        }
        
      }
     criterianStorage = criterianStorage[0];
      const sorted_ascendingly = [];
      criterianStorage.map(obj => {
        sorted_ascendingly[obj.OCDS.id.split(' ')[1]] = obj;
      });

      const select_default_data_from_fetch_dynamic_api = sorted_ascendingly;
      const lotId = req.session?.lotId;
      const agreementLotName = req.session.agreementLotName;
      const excludingKeyDates = select_default_data_from_fetch_dynamic_api.filter(
        AField => AField.OCDS.id !== 'Group Key Dates',
      );
      const excludingIR35andSkills = excludingKeyDates.filter(field => (field.OCDS.description !== 'IR35 acknowledgement' && field.OCDS.description !== 'Set essential and preferred skills'));
      if (excludingIR35andSkills !=null && excludingIR35andSkills.length >0) {
        excludingIR35andSkills.map(x => {
          if (!x.nonOCDS.mandatory) {
            x.OCDS.description += " (optional)"
          }
        });
      }
      
      // let text='';
      // for(var i=0;i<excludingIR35andSkills.length;i++)
      // {
      //   text=excludingIR35andSkills[i].OCDS.description;
      //   switch(text)
      //   {
      //     case 'Learn about adding context and requirements':
      //       excludingIR35andSkills[i].OCDS.description='Learn more about adding context and requirements';
      //       break;
      //     case 'Terms and acronyms':
      //       excludingIR35andSkills[i].OCDS.description='Terms and acronyms (optional)';
      //       break;
      //     case 'Background and context to your requirement':
      //       excludingIR35andSkills[i].OCDS.description='Background to your procurement';
      //       break;
      //     case 'Problem to solve/impact of not completing deliverables and outcome':
      //       excludingIR35andSkills[i].OCDS.description='The business problem you need to solve';
      //       break;
      //     case 'Key Users':
      //       excludingIR35andSkills[i].OCDS.description='The people who will use your product or service (optional)';
      //       break;
      //     case 'Work Completed to date':
      //       excludingIR35andSkills[i].OCDS.description='Any work that has been done so far (optional)';
      //       break;
      //     case 'Current phase of the project':
      //       excludingIR35andSkills[i].OCDS.description='Which phase the project is currently in';
      //       break;
      //     case 'Phase resource is required for':
      //       excludingIR35andSkills[i].OCDS.description='Which phase(s) of the project you need resource for';
      //       break;
      //     case 'Duration of work/resource required for':
      //       excludingIR35andSkills[i].OCDS.description='The expected duration of the project';
      //       break;
      //     case 'The buying organisation':
      //       excludingIR35andSkills[i].OCDS.description='Who the buying organisation is (optional)';
      //       break;
      //     case 'Market engagement to date':
      //       excludingIR35andSkills[i].OCDS.description='Describe any market engagement you\'ve done (optional)';
      //       break;
      //     case 'New, replacement or expanded services or products':
      //       excludingIR35andSkills[i].OCDS.description='Choose if this a new, replacement or expanded service or product';
      //       break;
      //     case 'Is there an incumbent supplier?':
      //       excludingIR35andSkills[i].OCDS.description='Tell us if there is an existing supplier';
      //       break;
      //     case 'Management information and reporting':
      //       excludingIR35andSkills[i].OCDS.description='Management information and reporting requirements';
      //       break;
      //     case 'Service levels and performance':
      //       excludingIR35andSkills[i].OCDS.description='Define your service levels and KPIs';
      //       break;
      //     case 'Incentives and exit strategy':
      //       excludingIR35andSkills[i].OCDS.description='Detail any performance incentives and exit strategies';
      //       break;
      //     case 'How the supplier is going to deliver within the budget constraints':
      //       excludingIR35andSkills[i].OCDS.description='Contract values and how suppliers will meet the project needs within this budget (optional)';
      //       break;
      //     case 'Add your requirements':
      //       excludingIR35andSkills[i].OCDS.description='Enter your project requirements';
      //       break;
      //   }
      // }

      const releatedContent = req.session.releatedContent;
      let selectedeventtype=req.session.selectedeventtype;
      const display_fetch_data = {
        data: excludingIR35andSkills,
        agreement_id: agreement_id,
        file_data: fileData,
        proc_id: proc_id,
        event_id: event_id,
        lotId,
        agreementLotName,
        releatedContent: releatedContent,
        selectedeventtype,
      };
      let flag = await ShouldEventStatusBeUpdated(eventId, 32, req);
      if (flag) {
        await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/32`, 'In progress');
      }
      res.render('rfp-context', display_fetch_data);
    } catch (error) {
      LoggTracer.errorLogger(
        res,
        error,
        `${req.headers.host}${req.originalUrl}`,
        null,
        TokenDecoder.decoder(SESSION_ID),
        'Tenders Service Api cannot be connected',
        true,
      );
    }
  }
};
