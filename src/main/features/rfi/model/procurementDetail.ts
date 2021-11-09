export default class procurementDetail {
    pocurementID:number;
    eventId:string;
    defaultName:procurmentNameDetail;
}

class procurmentNameDetail{
    name:string;
    components:agreementComponent;
}
class agreementComponent{
    agreementId:string;
    lotId:string;
    org:string;
}