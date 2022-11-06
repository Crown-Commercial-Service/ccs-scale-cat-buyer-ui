import { TenderApi } from '../common/util/fetch/procurementService/TenderApiInstance';

export async function ccsStatusOverride(dataJson: any, SESSION_ID: any, agreement_id: string, projectId: string, event_id: string ) {
    interface stepDataType {
        step: number,
        state: string
    }
    const {data: step} = await TenderApi.Instance(SESSION_ID).get(`/journeys/${event_id}/steps`);
    
    dataJson.events.forEach((event: any) => {
        if(agreement_id == 'RM1557.13') {
            if([82, 83, 84, 85].includes(event.eventno)) {
                let stapeJourney = step.find((stepData: stepDataType)  => stepData.step === event.eventno);
                if (stapeJourney.state === 'Not started') {
                    event.status = 'TODO';
                } else if (stapeJourney.state === 'Completed') {
                    event.status = 'DONE';
                } else {
                    event.status = stapeJourney.state;
                }
            }
            
        }
    });
}