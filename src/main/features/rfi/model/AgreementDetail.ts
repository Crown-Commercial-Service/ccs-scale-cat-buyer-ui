import {partyRole} from './partyRole'

export default class agreementDetail {
    number:number;
    name:string;
    description:string;
    startDate:Date;
    endDate:Date;
    detailUrl:string;
    owner:organization[]
    contacts:contactDetail[];
    benefits:string[];
    lots:lotSummary[];    
}

class organization{
    name:string;
    id:string;
    identifier:identifier;
    additionalIdentifiers:identifier[];
    address:address;
    contactPoint:contactPoint;
    roles:partyRole
    detail:organizationDetails;
}

class contactDetail{
    contact:organizationContact;
    contactId:string;
    contactReason:string;
}

class lotSummary{
    number:string;
    name:string;
}
class identifier{
    scheme:string;
    id:string;
    legalName:string;
    uri:string;
}
class address{
    streetAddress:string;
    locality:string;
    region:string;
    postalCode:string;
    countryName:string;
    coutryCode:string;
}
class contactPoint{
    name:string;
    email?:string;
    telephone:string;
    faxNumber:string;
    url?:string;
}
class organizationDetails{
    scale:string;
    creationDate:Date;
    countryCode:string;
    companyType:string;
    is_vcse:number;
    status:string;
    active:number;
    organizationId:string;
    isSme:boolean;
    rightToBuy:boolean;    
}
class organizationContact{
    name:string;
    email:string;
    telephone:string;
    faxNumber:string;
    url:string;
}