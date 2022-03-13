export interface ActiveEvents {
    projectId:     number;
    projectName:   string;
    agreementId:   string;
    agreementName: string;
    lotId:         string;
    lotName:       string;
    activeEvent:   ActiveEvent;
}

export interface ActiveEvent {
    id:             string;
    title:          string;
    eventStage:     string;
    status:         string;
    tenderPeriod:   TenderPeriod;
    eventSupportId: string;
    eventType:      string;
}

export interface TenderPeriod {
    startDate: Date;
    endDate:   Date;
}