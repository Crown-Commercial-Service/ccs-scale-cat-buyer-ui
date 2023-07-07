import { describe, it, expect, beforeEach } from 'vitest';
import { getValue, statusStepsDataFilter } from '@utils/statusStepsDataFilter';

import mcf3RfiData from '../../main/resources/content/MCF3/rfiTaskList.json';
import dspRfiData from '../../main/resources/content/RFI/rfiTaskList.json';
import gcloud13RfiData from '../../main/resources/content/MCF3/gcloudRfiTaskList.json';
import dos6RfiData from '../../main/resources/content/RFI/dosrfiTaskList.json';

import mcf3EoiData from '../../main/resources/content/MCF3/eoi/eoiTaskList.json';
import eoiData from '../../main/resources/content/eoi/eoiTaskList.json';

import mcf3RfpData from '../../main/resources/content/MCF3/requirements/rfpTaskList.json';
import dspRfpData from '../../main/resources/content/requirements/rfpTaskList.json';
import gcloud13RfpData from '../../main/resources/content/requirements/rfpGCLOUDTaskList.json';
import dos6RfpData from '../../main/resources/content/MCF3/requirements/DOSrfpTaskList.json';
import dos6Stage2RfpData from '../../main/resources/content/MCF3/requirements/DOSsatge2TaskList.json';

import fcaData from '../../main/resources/content/MCF3/fcaCreateSupplierSecondList.json';

import mcf3DaaData from '../../main/resources/content/requirements/daTaskList-B1.json';
import dspDaaData from '../../main/resources/content/requirements/daTaskList-B2.json';
import gcloud13DaaData from '../../main/resources/content/requirements/daTaskList-B3.json';
import dos6DaaData from '../../main/resources/content/requirements/daTaskList-B4.json';

import daData from '../../main/resources/content/da/daTaskList.json';

import statusStepsData from '../../test/fixtures/statusStepsData.json';

describe('Status steps data filter', () => {
  describe('.getValue', () => {
    it('returns Optional when the state key is Optional', () => {
      expect(getValue('Optional')).to.eq('Optional');
    });

    it('returns To do when the state key is Not started', () => {
      expect(getValue('Not started')).to.eq('To do');
    });

    it('returns Cannot start yet when the state key is Cannot start yet', () => {
      expect(getValue('Cannot start yet')).to.eq('Cannot start yet');
    });

    it('returns In progress when the state key is In progress', () => {
      expect(getValue('In progress')).to.eq('In progress');
    });

    it('returns Done when the state key is Completed', () => {
      expect(getValue('Completed')).to.eq('Done');
    });

    it('returns null when the state key is anything else', () => {
      expect(getValue('Something else')).to.eq(null);
    });
  });

  describe('.statusStepsDataFilter', () => {
    let data: { [key: string]: any };
    let type: string;
    let agreementId: string;
    const steps = statusStepsData.steps;
    const projectId = 'project-id';
    const eventId = 'event-id';

    describe('when the type is rfi', () => {
      beforeEach(() => {
        type = 'rfi';
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
          data = mcf3RfiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfi/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/choose-build-your-rfi',
              title: 'Choose how to build your RfI',
              required: 'mandatory',
              status: 'To do',
            },
            {
              Task: 2,
              link: '/rfi/online-task-list',
              title: 'Build your RfI',
              required: 'mandatory',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/upload-doc',
            },
            {
              Task: 2,
              title: 'View suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/suppliers',
            },
            {
              Task: 3,
              title: 'Set your RfI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
          data = dspRfiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfi/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 2,
              link: '/rfi/online-task-list',
              title: 'Build your RfI',
              required: 'mandatory',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/upload-doc',
            },
            {
              Task: 2,
              title: 'Confirm the suppliers who will receive your RfI',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/suppliers',
            },
            {
              Task: 3,
              title: 'Your RfI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your RfI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
          data = gcloud13RfiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfi/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/type',
              title: 'Choose how to build your RfI',
              required: 'mandatory',
              status: 'To do',
            },
            {
              Task: 2,
              link: '/rfi/online-task-list',
              title: 'Build your RfI',
              required: 'mandatory',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents ',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/upload-doc',
            },
            {
              Task: 2,
              title: 'Set your RfI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish your RfI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
          data = dos6RfiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfi/procurement-lead',
              title: 'Change who will lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfi/choose-build-your-rfi',
              title: 'Choose how to build your Rfi',
              required: 'mandatory',
              status: 'To do',
            },
            {
              Task: 2,
              link: '/rfi/online-task-list',
              title: 'Build your RfI',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/upload-doc',
            },
            {
              Task: 2,
              title: 'See the available suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfi/suppliers',
            },
            {
              Task: 3,
              title: 'Your RfI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your RfI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfi/review',
            },
          ]);
        });
      });
    });

    describe('when the type is eoi', () => {
      beforeEach(() => {
        type = 'eoi';
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
          data = mcf3EoiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/eoi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/eoi/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/eoi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose how to build your EoI',
              required: 'mandatory',
              link: '/eoi/type',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/eoi/online-task-list?agreement_id=RM6187&proc_id=project-id&event_id=event-id',
              title: 'Build your EoI',
              required: 'mandatory',
              status: 'In progress',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents',
              required: 'optional',
              status: 'In progress',
              link: '/eoi/upload-doc',
            },
            {
              Task: 2,
              title: 'View suppliers',
              required: 'Cannot start yet',
              status: 'In progress',
              link: '/eoi/suppliers',
            },
            {
              Task: 3,
              title: 'Set your EoI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your EoI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
          data = eoiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/eoi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/eoi/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/eoi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose how to build your EoI',
              required: 'mandatory',
              link: '/eoi/type',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/eoi/online-task-list?agreement_id=RM6263&proc_id=project-id&event_id=event-id',
              title: 'Build your EoI',
              required: 'mandatory',
              status: 'In progress',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents or add links',
              required: 'optional',
              status: 'In progress',
              link: '/eoi/upload-doc',
            },
            {
              Task: 2,
              title: 'Look at the available suppliers',
              required: 'Cannot start yet',
              status: 'In progress',
              link: '/eoi/suppliers',
            },
            {
              Task: 3,
              title: 'Your EoI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your EoI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
          data = eoiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/eoi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/eoi/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/eoi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose how to build your EoI',
              required: 'mandatory',
              link: '/eoi/type',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/eoi/online-task-list?agreement_id=RM1557.13&proc_id=project-id&event_id=event-id',
              title: 'Build your EoI',
              required: 'mandatory',
              status: 'In progress',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents or add links',
              required: 'optional',
              status: 'In progress',
              link: '/eoi/upload-doc',
            },
            {
              Task: 2,
              title: 'Look at the available suppliers',
              required: 'Cannot start yet',
              status: 'In progress',
              link: '/eoi/suppliers',
            },
            {
              Task: 3,
              title: 'Your EoI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your EoI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
          data = eoiData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/eoi/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/eoi/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/eoi/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose how to build your EoI',
              required: 'mandatory',
              link: '/eoi/type',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/eoi/online-task-list?agreement_id=RM1043.8&proc_id=project-id&event_id=event-id',
              title: 'Build your EoI',
              required: 'mandatory',
              status: 'In progress',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload documents or add links',
              required: 'optional',
              status: 'In progress',
              link: '/eoi/upload-doc',
            },
            {
              Task: 2,
              title: 'Look at the available suppliers',
              required: 'Cannot start yet',
              status: 'In progress',
              link: '/eoi/suppliers',
            },
            {
              Task: 3,
              title: 'Your EoI timeline',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/response-date',
            },
            {
              Task: 4,
              title: 'Review and publish your EoI',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/eoi/review',
            },
          ]);
        });
      });
    });

    describe('when the type is rfp', () => {
      beforeEach(() => {
        type = 'rfp';
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
          data = mcf3RfpData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/rfp/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/rfp/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your assessment criteria and evaluation weightings',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/your-assessment',
            },
            {
              Task: 2,
              title: 'How you will score suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/set-scoring-criteria',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'View suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/suppliers',
            },
            {
              Task: 2,
              title: 'Set your timeline ',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfp/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
          data = dspRfpData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who is going to lead the project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule',
              required: 'mandatory',
              link: '/rfp/upload',
              status: 'To do',
            },
            {
              Task: 2,
              title: 'Confirm if you need a contracted out service or supply of resource.',
              required: 'optional',
              link: '/rfp/IR35',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose the roles you need',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/vetting-weighting',
            },
            {
              Task: 2,
              title: 'Set your highest security and vetting requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/choose-security-requirements',
            },
            {
              Task: 3,
              title: 'Select essential skills and capabilities',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/service-capabilities',
            },
            {
              Task: 4,
              title: 'Where the work will be done',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/where-work-done',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your assessment criteria and evaluation weightings',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/your-assessment',
            },
            {
              Task: 2,
              title: 'How you will score suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/set-scoring-criteria',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'See the available suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/suppliers',
            },
            {
              Task: 2,
              title: 'Your timeline ',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfp/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
          data = gcloud13RfpData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/rfp/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/rfp/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your assessment criteria and evaluation weightings',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/your-assessment',
            },
            {
              Task: 2,
              title: 'How you will score suppliers',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/set-scoring-criteria',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your timeline',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/rfp/response-date',
            },
            {
              Task: 2,
              title: 'Review and publish',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/rfp/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
        });

        describe('and the stage 2 value not present', () => {
          beforeEach(() => {
            data = dos6RfpData;
          });

          it('updates the event task statuses', () => {
            statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

            const events = data.events;

            expect(events[0]['eventTask']).to.eql([
              {
                Task: 1,
                link: '/rfp/name-your-project',
                title: 'Name your project',
                required: 'mandatory',
                status: 'Optional',
              },
              {
                Task: 2,
                link: '/rfp/procurement-lead',
                title: 'Change who will lead your project',
                required: 'optional',
                status: 'Optional',
              },
              {
                Task: 3,
                link: '/rfp/add-collaborators',
                title: 'Add colleagues to your project',
                required: 'optional',
                status: 'To do',
              },
            ]);
            expect(events[1]['eventTask']).to.eql([
              {
                Task: 1,
                title: ' Add context and requirements',
                required: 'optional',
                status: 'To do',
                link: '/rfp/add-context',
              },
            ]);
            expect(events[2]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Upload additional documents (optional)',
                required: 'optional',
                link: '/rfp/upload-additional',
                status: 'Cannot start yet',
              },
            ]);
            expect(events[3]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Your assessment criteria',
                required: 'optional',
                status: 'Cannot start yet',
                link: '/rfp/your-assessment',
              },
              {
                Task: 2,
                title: 'How you will score supplier responses',
                required: 'mandatory',
                status: 'Cannot start yet',
                link: '/rfp/set-scoring-criteria',
              },
            ]);
            expect(events[4]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Set your timeline',
                required: 'optional',
                status: 'Cannot start yet',
                link: '/rfp/response-date',
              },
              {
                Task: 2,
                title: 'Review and publish stage 1',
                required: 'mandatory',
                status: 'Cannot start yet',
                link: '/rfp/review',
              },
            ]);
            expect(events[5]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Number of suppliers who responded to stage 1',
                required: 'mandatory',
                link: '/rfp/upload',
                status: 'Cannot start yet',
              },
              {
                Task: 2,
                title: 'Choose suppliers for stage 2',
                required: 'mandatory',
                link: '/rfp/upload',
                status: 'Cannot start yet',
              },
              {
                Task: 3,
                title: 'Upload your pricing schedule and other documents',
                required: 'mandatory',
                link: '/rfp/upload',
                status: 'Cannot start yet',
              },
              {
                Task: 4,
                title: 'Set your timeline',
                required: 'optional',
                link: '/rfp/IR35',
                status: 'Cannot start yet',
              },
              {
                Task: 5,
                title: 'Review and publish stage 2',
                required: 'optional',
                link: '/rfp/IR35',
                status: 'Cannot start yet',
              },
            ]);
          });
        });

        describe('and the stage 2 value is Stage 2', () => {
          beforeEach(() => {
            data = dos6Stage2RfpData;
          });

          it('updates the event task statuses', () => {
            statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId, 'Stage 2');

            const events = data.events;

            expect(events[0]['eventTask']).to.eql([
              {
                Task: 1,
                link: '/rfp/name-your-project',
                title: 'Name your project',
                required: 'mandatory',
                status: 'Optional',
              },
              {
                Task: 2,
                link: '/rfp/procurement-lead',
                title: 'Change who will lead your project',
                required: 'optional',
                status: 'Optional',
              },
              {
                Task: 3,
                link: '/rfp/add-collaborators',
                title: 'Add members to your project',
                required: 'optional',
                status: 'To do',
              },
            ]);
            expect(events[1]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Upload your pricing schedule and other documents',
                required: 'mandatory',
                link: '/rfp/upload',
                status: 'To do',
              },
            ]);
            expect(events[2]['eventTask']).to.eql([
              {
                Task: 1,
                title: 'Set your timeline',
                required: 'mandatory',
                status: 'To do',
                link: '/rfp/response-date',
              },
              {
                Task: 2,
                title: 'Review and publish stage 2',
                required: 'mandatory',
                status: 'Cannot start yet',
                link: '/rfp/review',
              },
            ]);
          });
        });
      });
    });

    describe('when the type is FCA', () => {
      beforeEach(() => {
        type = 'FCA';
        data = fcaData;
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/fca/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/select-services',
              title: 'Select the services you need',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/shortlisted/suppliers',
              title: 'View or download your shortlisted suppliers',
              required: 'mandatory',
              status: 'In progress',
            },
            {
              Task: 3,
              link: '/fca/next-step',
              title: 'Choose your next steps ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/fca/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/select-services',
              title: 'Select the services you need',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/shortlisted/suppliers',
              title: 'View or download your shortlisted suppliers',
              required: 'mandatory',
              status: 'In progress',
            },
            {
              Task: 3,
              link: '/fca/next-step',
              title: 'Choose your next steps ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/fca/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/select-services',
              title: 'Select the services you need',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/shortlisted/suppliers',
              title: 'View or download your shortlisted suppliers',
              required: 'mandatory',
              status: 'In progress',
            },
            {
              Task: 3,
              link: '/fca/next-step',
              title: 'Choose your next steps ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/fca/add-collaborators',
              title: 'Add colleagues to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/fca/select-services',
              title: 'Select the services you need',
              required: 'mandatory',
              status: 'Done',
            },
            {
              Task: 2,
              link: '/fca/shortlisted/suppliers',
              title: 'View or download your shortlisted suppliers',
              required: 'mandatory',
              status: 'In progress',
            },
            {
              Task: 3,
              link: '/fca/next-step',
              title: 'Choose your next steps ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
        });
      });
    });

    describe('when the type is DAA', () => {
      beforeEach(() => {
        type = 'DAA';
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
          data = mcf3DaaData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/da/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/da/add-collaborators',
              title: 'Add members to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Learn about capability assessment',
              required: 'optional',
              link: '/da/learn-about-capability-assessment',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/enter-your-weightings',
              title: ' Enter your weightings ',
              required: 'mandatory',
              status: 'To do',
            },
            {
              Task: 3,
              link: '/da/accept-subcontractors',
              title: ' Will you accept sub-contractors? ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 4,
              link: '/da/resources-vetting-weightings',
              title: ' Set your resources and vetting weightings ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 5,
              link: '/da/choose-security-requirements',
              title: 'Choose highest security and vetting requirements',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 6,
              link: '/da/service-capabilities',
              title: ' Select your service capabilities ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 7,
              link: '/da/team-scale',
              title: 'How well your team will scale ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 8,
              link: '/da/where-work-done',
              title: ' Where the work will be done ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 10,
              link: '/da/review-ranked-suppliers',
              title: ' Review ranked suppliers ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
            {
              Task: 11,
              link: '/da/next-steps',
              title: 'Next steps ',
              required: 'mandatory',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload pricing schedules and any other supporting documentation',
              required: 'optional',
              link: '/da/upload-pricing-supporting-doc',
              status: 'Cannot start yet',
            },
            {
              Task: 2,
              title: 'IR35 acknowledgement',
              required: 'optional',
              link: '/da/upload-pricing-supporting-doc',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements ',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Your assessment bases and evaluation weightings ',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 1,
              title: ' Set your scoring criteria ',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[6]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Review the supplier for this direct award',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 2,
              title: 'Set response date and time',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 3,
              title: 'Review and publish your 2-stage RFP',
              required: 'optional',
              link: '#',
              status: 'Cannot start yet',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
          data = dspDaaData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add members to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Learn about capability assessment',
              required: 'optional',
              link: '#',
              status: 'Optional',
            },
            {
              Task: 2,
              title: 'Enter your weightings',
              required: 'mandatory',
              link: '#',
              status: 'To do',
            },
            {
              Task: 3,
              title: 'Will you accept sub-contractors?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 4,
              title: 'Set your resources and vetting weightings',
              required: 'mandatory',
              link: '/da/resources-vetting-weightings',
              status: 'Cannot start yet',
            },
            {
              Task: 5,
              title: 'Select your service capabilities',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 6,
              title: 'How well your team will scale?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 7,
              title: 'Where the work will be done',
              required: 'mandatory',
              link: '/da/where-work-done',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
          data = gcloud13DaaData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add members to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Learn about capability assessment',
              required: 'optional',
              link: '#',
              status: 'Optional',
            },
            {
              Task: 2,
              title: 'Enter your weightings',
              required: 'mandatory',
              link: '#',
              status: 'To do',
            },
            {
              Task: 3,
              title: 'Will you accept sub-contractors?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 4,
              title: 'Set your resources and vetting weightings',
              required: 'mandatory',
              link: '/da/resources-vetting-weightings',
              status: 'Cannot start yet',
            },
            {
              Task: 5,
              title: 'Select your service capabilities',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 6,
              title: 'How well your team will scale?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 7,
              title: 'Where the work will be done',
              required: 'mandatory',
              link: '/da/where-work-done',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
          data = dos6DaaData;
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/rfp/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/rfp/procurement-lead',
              title: 'Change who is going to lead the procurement',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/rfp/add-collaborators',
              title: 'Add members to your project',
              required: 'optional',
              status: 'Optional',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Learn about capability assessment',
              required: 'optional',
              link: '#',
              status: 'Optional',
            },
            {
              Task: 2,
              title: 'Enter your weightings',
              required: 'mandatory',
              link: '#',
              status: 'To do',
            },
            {
              Task: 3,
              title: 'Will you accept sub-contractors?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 4,
              title: 'Set your resources and vetting weightings',
              required: 'mandatory',
              link: '/da/resources-vetting-weightings',
              status: 'Cannot start yet',
            },
            {
              Task: 5,
              title: 'Select your service capabilities',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 6,
              title: 'How well your team will scale?',
              required: 'mandatory',
              link: '#',
              status: 'Cannot start yet',
            },
            {
              Task: 7,
              title: 'Where the work will be done',
              required: 'mandatory',
              link: '/da/where-work-done',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
        });
      });
    });

    describe('when the type is DA', () => {
      beforeEach(() => {
        type = 'DA';
        data = daData;
      });

      describe('and the agreemnt is MCF3 (RM6187)', () => {
        beforeEach(() => {
          agreementId = 'RM6187';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/da/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/da/add-collaborators',
              title: 'Add collegues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/da/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/da/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your evaluation questions',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/your-assesstment',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose the supplier for direct award',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/suppliers',
            },
            {
              Task: 2,
              title: 'Set your timeline',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/da/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DSP (RM6263)', () => {
        beforeEach(() => {
          agreementId = 'RM6263';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/da/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/da/add-collaborators',
              title: 'Add collegues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/da/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/da/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your evaluation questions',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/your-assesstment',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose the supplier for direct award',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/suppliers',
            },
            {
              Task: 2,
              title: 'Set your timeline',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/da/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is G-Cloud 13 (RM1557.13)', () => {
        beforeEach(() => {
          agreementId = 'RM1557.13';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/da/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/da/add-collaborators',
              title: 'Add collegues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/da/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/da/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your evaluation questions',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/your-assesstment',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose the supplier for direct award',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/suppliers',
            },
            {
              Task: 2,
              title: 'Set your timeline',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/da/review',
            },
          ]);
        });
      });

      describe('and the agreemnt is DOS6 (RM1043.8)', () => {
        beforeEach(() => {
          agreementId = 'RM1043.8';
        });

        it('updates the event task statuses', () => {
          statusStepsDataFilter(data, steps, type, agreementId, projectId, eventId);

          const events = data.events;

          expect(events[0]['eventTask']).to.eql([
            {
              Task: 1,
              link: '/da/name-your-project',
              title: 'Name your project',
              required: 'mandatory',
              status: 'Optional',
            },
            {
              Task: 2,
              link: '/da/procurement-lead',
              title: 'Change who will lead your project',
              required: 'optional',
              status: 'Optional',
            },
            {
              Task: 3,
              link: '/da/add-collaborators',
              title: 'Add collegues to your project',
              required: 'optional',
              status: 'To do',
            },
          ]);
          expect(events[1]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Select the services you need',
              required: 'mandatory',
              link: '/da/selected_service',
              status: 'To do',
            },
          ]);
          expect(events[2]['eventTask']).to.eql([
            {
              Task: 1,
              title: ' Add context and requirements',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/add-context',
            },
          ]);
          expect(events[3]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Upload your pricing schedule and other documents',
              required: 'mandatory',
              link: '/da/upload',
              status: 'Cannot start yet',
            },
          ]);
          expect(events[4]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Set your evaluation questions',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/your-assesstment',
            },
          ]);
          expect(events[5]['eventTask']).to.eql([
            {
              Task: 1,
              title: 'Choose the supplier for direct award',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/suppliers',
            },
            {
              Task: 2,
              title: 'Set your timeline',
              required: 'optional',
              status: 'Cannot start yet',
              link: '/da/response-date',
            },
            {
              Task: 3,
              title: 'Review and publish ',
              required: 'mandatory',
              status: 'Cannot start yet',
              link: '/da/review',
            },
          ]);
        });
      });
    });
  });
});
