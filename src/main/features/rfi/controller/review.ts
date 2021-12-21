//@ts-nocheck
import * as express from 'express';
import * as cmsData from '../../../resources/content/RFI/review.json';
import {DynamicFrameworkInstance} from '../util/fetch/dyanmicframeworkInstance'
import { LoggTracer } from '../../../common/logtracer/tracer';
import { TokenDecoder } from '../../../common/tokendecoder/tokendecoder';
import { LogMessageFormatter } from '../../../common/logtracer/logmessageformatter';


//@GET /rfi/review
export const GET_RFI_REVIEW  = async (req: express.Request, res: express.Response) => {
    const {SESSION_ID} = req.cookies;
    const ProjectID = req.session['projectId'];
    const EventID = req.session['eventId'];
    const BaseURL = `/tenders/projects/${ProjectID}/events/${EventID}`
    try {
        const FetchReviewData = await DynamicFrameworkInstance.Instance(SESSION_ID).get(BaseURL);
        const ReviewData = FetchReviewData.data;
        //Buyer Questions
        const BuyerQuestions = ReviewData.nonOCDS.buyerQuestions;
        const BuyerAnsweredAnswers = BuyerQuestions.map(buyer => {
            const data = buyer.requirementGroups.map(group=> {
                const OCDS = group.OCDS;
                const nonOCDS = group.nonOCDS;
                nonOCDS.criterian = buyer.id;
                return {"nonOCDS": nonOCDS, "OCDS": OCDS}
            });
            return {"requirement": data}}
        ).flat();

        //JSONData; 
        let Rfi_answered_questions = BuyerAnsweredAnswers.map(rfi => rfi.requirement).flat()
        
        const GROUP1_Toggle = Rfi_answered_questions.filter(question => question.OCDS.id === 'Group 1')[0];
        const ToggledTrue = GROUP1_Toggle.OCDS.requirements.filter(reqs => reqs.OCDS.id === 'Question 1')[0];
        const selectedToggled = ToggledTrue.nonOCDS.options.map(op => {
            return {"value": op.value, selected: true}
        })
        ToggledTrue.nonOCDS.options = selectedToggled;
        GROUP1_Toggle.OCDS.requirements.map(group => {
            if(group.OCDS.id === "Question 1") return ToggledTrue
            else return group
        })
        Rfi_answered_questions = Rfi_answered_questions.map(question => {
            if(question.OCDS.id === "Group 1") return GROUP1_Toggle
            else return question
        })

        const ExtractedRFI_Answers = Rfi_answered_questions.map(question => {
            return {
                "title": question.OCDS.description,
                "id": question.OCDS.id,
                "answers": question.OCDS.requirements.map(o => {
                    return {"question": o.OCDS?.title, "values": o.nonOCDS.options}
                })
            }
        })

        const FilteredSetWithTrue = ExtractedRFI_Answers.map(questions => {
            return {
                "title": questions.title,
                "id": questions.id,
                "answer": questions.answers.map(answer => {
                    return {
                        "question": answer.question,
                        "values": answer.values.filter(val => val.selected)
                    }
                })
            }
        })

        const RFI_DATA_WITHOUT_KEYDATES = FilteredSetWithTrue.filter(obj => obj.id !== "Key Dates");

        const RFI_DATA_TIMELINE_DATES = FilteredSetWithTrue.filter(obj => obj.id === 'Key Dates')

        const appendData = {
            rfi_data : RFI_DATA_WITHOUT_KEYDATES,
            rfi_keydates : RFI_DATA_TIMELINE_DATES[0],
            data: cmsData
        }

        res.render('review', appendData)

    } catch (error) {
        console.log('Something went wrong, please review the logit error log for more information');
        delete error?.config?.['headers'];
        const Logmessage = {
          Person_id: TokenDecoder.decoder(SESSION_ID),
          error_location: `${req.headers.host}${req.originalUrl}`,
          sessionId: 'null',
          error_reason: 'Dyanamic framework throws error - Tender Api is causing problem',
          exception: error,
        };
        const Log = new LogMessageFormatter(
          Logmessage.Person_id,
          Logmessage.error_location,
          Logmessage.sessionId,
          Logmessage.error_reason,
          Logmessage.exception,
        );
        LoggTracer.errorTracer(Log, res);
    }
  



}




//@POST  /rfi/review


export const POST_RFI_REVIEW  = (req: express.Request, res: express.Response) => {
   
    res.redirect('/rfi/event-sent')
}