export interface Message {
    OCDS:    Ocds;
    nonOCDS: NonOCDS;
}

export interface Ocds {
    id:         string;
    date:       string;
    author:     string;
    relatedLot: string;
}

export interface NonOCDS {
    read:      boolean;
    direction: string;
    counts:    Counts;
    links:     string;
}

export interface Counts {
    pageTotal:     number;
    messagesTotal: number;
}
