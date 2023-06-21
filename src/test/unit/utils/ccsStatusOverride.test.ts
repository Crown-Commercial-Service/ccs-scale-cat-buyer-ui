import { expect } from 'chai';
import Sinon from 'sinon';
import { ccsStatusOverride, JourneyEvent, StepData } from '@utils/ccsStatusOverride';
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';

describe('CCS status override', () => {
  const SESSION_ID = 'SESSION_ID';
  const eventId = 'EVENT_ID';
  const dataJson: {
    events: JourneyEvent[];
  } = {
    events: [
      {
        eventno: 81,
        status: 'Default',
      },
      {
        eventno: 82,
        status: 'Default',
      },
      {
        eventno: 83,
        status: 'Default',
      },
      {
        eventno: 84,
        status: 'Default',
      },
      {
        eventno: 85,
        status: 'Default',
      },
      {
        eventno: 86,
        status: 'Default',
      },
    ],
  };
  let agreementId: string;

  describe('when the agreementId is not RM1557.13', async () => {
    it('does not change any event statuses', async () => {
      agreementId = 'RM6263';

      await ccsStatusOverride(dataJson, SESSION_ID, agreementId, eventId);

      expect(dataJson.events).to.eql([
        {
          eventno: 81,
          status: 'Default',
        },
        {
          eventno: 82,
          status: 'Default',
        },
        {
          eventno: 83,
          status: 'Default',
        },
        {
          eventno: 84,
          status: 'Default',
        },
        {
          eventno: 85,
          status: 'Default',
        },
        {
          eventno: 86,
          status: 'Default',
        },
      ]);
    });
  });

  describe('when the agreementId is RM1557.13', async () => {
    it('does change the event statuses', async () => {
      agreementId = 'RM1557.13';
      const stepData: StepData[] = [
        {
          step: 81,
          state: 'Optional',
        },
        {
          step: 82,
          state: 'Completed',
        },
        {
          step: 83,
          state: 'Completed',
        },
        {
          step: 84,
          state: 'Not started',
        },
        {
          step: 85,
          state: 'Cannot start yet',
        },
        {
          step: 86,
          state: 'In progress',
        },
        {
          step: 86,
          state: 'Optional',
        },
      ];

      const tenderApiInstanceStub = Sinon.stub();

      Sinon.mock(TenderApi).expects('Instance').withArgs(SESSION_ID).returns(tenderApiInstanceStub);
      Sinon.mock(tenderApiInstanceStub)
        .expects('get')
        .withArgs(`/journeys/${eventId}/steps`)
        .returns({ data: stepData });

      await ccsStatusOverride(dataJson, SESSION_ID, agreementId, eventId);

      expect(dataJson.events).to.eql([
        {
          eventno: 81,
          status: 'Default',
        },
        {
          eventno: 82,
          status: 'DONE',
        },
        {
          eventno: 83,
          status: 'DONE',
        },
        {
          eventno: 84,
          status: 'TODO',
        },
        {
          eventno: 85,
          status: 'Cannot start yet',
        },
        {
          eventno: 86,
          status: 'Default',
        },
      ]);
    });
  });
});
