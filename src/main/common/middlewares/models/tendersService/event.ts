enum EventStatus {
  WITHDRAWN = 'withdrawn',
  IN_PROGRESS = 'In-Progress',
  PUBLISHED = 'Published',
  TO_BE_EVALUATED = 'To Be Evaluated',
  EVALUATING = 'Evaluating',
  EVALUATED = 'Evaluated',
  PRE_AWARD = 'Pre-award',
  AWARDED = 'Awarded',
  ASSESSMENT = 'Assessment'
}

enum EventTypes {
  RFI = 'RFI',
  EOI = 'EOI',
  TBD = 'TBD',
  PA = 'PA',
  FCA = 'FCA',
  DAA = 'DAA',
  FC = 'FC',
  DA = 'DA'
}

enum EventDashboardStatus {
  IN_PROGRESS = 'IN-PROGRESS',
  PUBLISHED = 'PUBLISHED',
  TO_BE_EVALUATED = 'TO-BE-EVALUATED',
  EVALUATING = 'EVALUATING',
  EVALUATED = 'EVALUATED',
  PRE_AWARD = 'PRE-AWARD',
  AWARDED = 'AWARDED',
  LOWER_AWARDED = 'Awarded',
  COMPLETE = 'COMPLETE',
  CLOSED = 'CLOSED',
  UNKNOWN = 'UNKNOWN',
  ASSESSMENT = 'ASSESSMENT'
}

interface Event {
  id: string
  title: string
  eventStage: string
  status: EventStatus
  tenderPeriod: TenderPeriod
  eventSupportId: string
  eventType: EventTypes
  dashboardStatus: EventDashboardStatus
  lastUpdated: string
}

interface TenderPeriod {
  startDate: string
  endDate: string
}

export { Event, EventStatus, EventTypes, EventDashboardStatus };
