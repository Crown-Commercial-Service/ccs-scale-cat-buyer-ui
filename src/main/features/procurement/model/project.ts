export interface Procurement {
    procurementID: string;
    eventId:       string;
    defaultName:   DefaultName;
    started:       boolean;
}

export interface DefaultName {
    name:       string;
    components: Components;
}

export interface Components {
    agreementId: string;
    lotId:       string;
    org:         string;
}
