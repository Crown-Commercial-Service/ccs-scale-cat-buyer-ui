export interface MessageDetails {
    OCDS:    Ocds;
    nonOCDS: NonOCDS;
}

export interface Ocds {
    id:          string;
    date:        string;
    author:      string;
    relatedLot:  string;
    description: string;
}

export interface NonOCDS {
    read:         boolean;
    direction:    string;
    answerId:     string;
    parentId:     string;
    isBroadcast:  boolean;
    receiverList: string[];
    readList:     string[];
    attachments:  Attachment[];
}

export interface Attachment {
    id:   number;
    name: string;
}
