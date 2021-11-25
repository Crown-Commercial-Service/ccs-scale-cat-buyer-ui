/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
/* tslint:disable:no-console */

import supertest = require('supertest');
import pa11y from 'pa11y';
import { expect } from 'chai'
import { app } from 'main/app'

import { CHOOSE_AGREEMENT_PATHS } from '../../main/features/agreement/model/agreementConstants';
import { DASHBOARD_PATHS } from '../../main/features/dashboard/model/dashboardConstants';
import { PROCUREMENT_PATHS } from '../../main/features/procurement/model/procurement';
import { RFI_PATHS } from '../../main/features/rfi/model/rficonstant';
import { ERROR_PATHS } from '../../main/errors/model/errorConstants';

app.locals.csrf = 'dummy-token'

const agent = supertest(app)

interface Issue {
  type: string,
  code: string
}
interface RequestDetails {
  method: 'get' | 'post',
  send?: any
}

async function runPa11y(url: string): Promise<Issue[]> {
  const result = await pa11y(url, {
    includeWarnings: true,
    // Ignore GovUK template elements that are outside the team's control from a11y tests
    hideElements: '#logo, .logo, .copyright, link[rel=mask-icon]',
    ignore: [
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Abs',  // Visual warning on invisible elements, so not relevant
      'WCAG2AA.Principle1.Guideline1_3.1_3_1_A.G141',  // DAC have rated Semantically Incorrect Headings as AAA, not AA
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Alpha', // DAC for This element's text or background contains transparency
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'   // This warning is releated to navigation, needs to be revist.
    ]
  })
  return result.issues
    .filter((issue: Issue) => issue.code !== 'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64.1')
    .filter((issue: Issue) => issue.code !== 'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoContent')
    .filter((issue: Issue) => issue.code !== 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H85.2')
}

function check(uri: string, requestDetails: RequestDetails = { method: 'get' }): void {
  describe(`Page ${uri}`, () => {

    describe(`Pa11y tests for ${uri}`, () => {
      let issues: Issue[]
      before(async () => {
        issues = await runPa11y(agent.get(uri).url)
      })

      it('should have no accessibility errors', () => {
        ensureNoAccessibilityAlerts('error', issues)
      })

      it('should have no accessibility warnings', () => {
        ensureNoAccessibilityAlerts('warning', issues)
      })
    })
  })
}

function ensureNoAccessibilityAlerts(issueType: string, issues: Issue[]): void {
  const alerts: Issue[] = issues.filter((issue: Issue) => issue.type === issueType)
  expect(alerts, `\n${JSON.stringify(alerts, null, 2)}\n`).to.be.empty
}

describe('Accessibility', () => {
  function checkPaths(url: string): void {
    check(url)
  }

  // Add all the routes which needs to be tested via pa11y
  checkPaths("/") // CaT frontend landing page
  checkPaths(CHOOSE_AGREEMENT_PATHS.CHOOSE_AGREEMENT)
  checkPaths(CHOOSE_AGREEMENT_PATHS.LOT_BEFORE_START_PAGE)
  checkPaths(CHOOSE_AGREEMENT_PATHS.SELECTED_AGREEMENT)
  checkPaths(DASHBOARD_PATHS.DASHBOARD)
  checkPaths(PROCUREMENT_PATHS.PROCUREMENT)
  checkPaths(RFI_PATHS.GET_ADD_COLLABORATOR)
  checkPaths(RFI_PATHS.GET_LEAD_PROCUEMENT)
  checkPaths(RFI_PATHS.GET_NAME_YOUR_PROJECT)
  checkPaths(RFI_PATHS.GET_ONLINE_TASKLIST)
  checkPaths(RFI_PATHS.GET_QUESTIONS)
  checkPaths(RFI_PATHS.GET_TASKLIST)
  checkPaths(RFI_PATHS.GET_TYPE)
  checkPaths(RFI_PATHS.GET_UPLOAD_DOC)
  checkPaths(RFI_PATHS.GET_USER_PROCUREMENT)

  checkPaths(RFI_PATHS.POST_ADD_COLLABORATOR)
  checkPaths(RFI_PATHS.POST_ADD_COLLABORATOR_TO_JAGGER)
  checkPaths(RFI_PATHS.POST_PROCEED_COLLABORTORS)
  checkPaths(RFI_PATHS.POST_PROJECT_NAME)
  checkPaths(RFI_PATHS.POST_QUESTIONS_QUESTIONNAIRE)
  checkPaths(RFI_PATHS.POST_QUESTIONS_WHO)
  checkPaths(RFI_PATHS.POST_TYPE_TYPE)
  checkPaths(RFI_PATHS.PUT_LEAD_PROCUREMENT)
  checkPaths(ERROR_PATHS.ROUTE_401);
  checkPaths(ERROR_PATHS.ROUTE_404);

})
