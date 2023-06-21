import { TenderApi } from '../common/util/fetch/procurementService/TenderApiInstance';

type JourneyEvent = {
  eventno: number;
  status: string;
};

type StepData = {
  step: number;
  state: string;
};

const getStepJourneyStatus = (state: string): string => {
  switch (state) {
  case 'Not started':
    return 'TODO';
  case 'Completed':
    return 'DONE';
  default:
    return state;
  }
};

const ccsStatusOverride = async (dataJson: any, SESSION_ID: any, agreementId: string, eventId: string) => {
  if (agreementId !== 'RM1557.13') return;

  const { data: step } = await TenderApi.Instance(SESSION_ID).get(`/journeys/${eventId}/steps`);

  const targetEventNo = [82, 83, 84, 85];

  dataJson.events.forEach((event: JourneyEvent) => {
    if (targetEventNo.includes(event.eventno)) {
      const stepJourney = step.find((stepData: StepData) => stepData.step === event.eventno);

      event.status = getStepJourneyStatus(stepJourney.state);
    }
  });
};

export { JourneyEvent, StepData };
export { ccsStatusOverride };
