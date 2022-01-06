//@ts-nocheck
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as express from 'express';
import { HttpStatusCode } from 'main/errors/httpStatusCodes';
import * as cmsData from '../../../resources/content/RFI/suppliers.json';

// RFI Suppliers
export const GET_RFI_SUPPLIERS  = (req: express.Request, res: express.Response) => {
    const supplierList= [ {
        "id":1,
        "legal_name":"AECOM LIMITED",
        "trading_name":"AECOM Ltd",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/1826/aecom-limited",
      },
      {
        "id":2,
        "legal_name":"Cognizant Worldwide Limited",
        "trading_name":"Cognizant Worldwide Limited",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/352/cognizant-worldwide-limited",
      },
      {
        "id":3,
        "legal_name":"Hippo Digital Limited",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/5308/hippo-digital-limited",
      },
      {
        "id":4,
        "legal_name":"IBM UNITED KINGDOM LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/316/ibm-united-kingdom-limited",
      },
      {
        "id":5,
        "legal_name":"INFORMED SOLUTIONS LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/799/informed-solutions-limited",
      },
      {
        "id":6,
        "legal_name":"KAINOS SOFTWARE LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/64/kainos-software-limited",
      },
      {
        "id":7,
        "legal_name":"MASTEK (UK) LTD.",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/398/mastek-uk-ltd",
      },
      {
        "id":8,
        "legal_name":"NETCOMPANY UK LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/324/netcompany-uk-limited",
      },
      {
        "id":9,
        "legal_name":"Net Consulting Ltd",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/348/net-consulting-ltd",
      },
      {
        "id":10,
        "legal_name":"Networkology Ltd",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/3699/networkology-ltd",
      },
      {
        "id":11,
        "legal_name":"OCO GLOBAL LIMITED",
        "trading_name":"OCO Global",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/9950/oco-global-limited",
      },
      {
        "id":12,
        "legal_name":"OFFICE FOR PUBLIC MANAGEMENT LIMITED",
        "trading_name":"Traverse Ltd",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/305/office-for-public-management-limited",
      },
      {
        "id":13,
        "legal_name":"ORACLE CORPORATION UK LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/2538/oracle-corporation-uk-limited",
      },
      {
        "id":14,
        "legal_name":"P.S. COMPUTER SERVICES LIMITED",
        "trading_name":" Parker Shaw",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/166/ps-computer-services-limited",
      },
      {
        "id":15,
        "legal_name":"PA CONSULTING SERVICES LIMITED",
        "trading_name":"PA Consulting Group",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/318/pa-consulting-services-limited",
      },
      {
        "id":16,
        "legal_name":"PALLADIUM INTERNATIONAL LIMITED",
        "trading_name":"Cognizant Worldwide Limited",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/9644/palladium-international-limited",
      },
      {
        "id":17,
        "legal_name":"PEOPLETOO LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/770/peopletoo-limited",
      },
      {
        "id":18,
        "legal_name":"ROCK I.T. SPECIALISTS LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/8497/rock-it-specialists-limited",
      },
      {
        "id":19,
        "legal_name":"RSM Risk Assurance Services LLP",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/5359/rsm-risk-assurance-services-llp",
      },
      {
        "id":20,
        "legal_name":"SAP (UK) Limited",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/2540/sap-uk-limited",
      },
      {
        "id":21,
        "legal_name":"SBC SYSTEMS (UK) LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/2161/sbc-systems-uk-limited",
      },
      {
        "id":22,
        "legal_name":"SPECIALIST COMPUTER CENTRES PLC",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/330/specialist-computer-centres-plc",
      },
      {
        "id":23,
        "legal_name":"TATA CONSULTANCY SERVICES LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/9699/tata-consultancy-services-limited",
      },
      {
        "id":24,
        "legal_name":"TELEFONICA UK LIMITED",
        "trading_name":"O2",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/1170/telefonica-uk-limited",
      },
      {
        "id":25,
        "legal_name":"TOTAL COMPUTER NETWORKS LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/373/total-computer-networks-limited",
      },
      {
        "id":26,
        "legal_name":"TRINITY IT CONSULTING LIMITED",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/189/trinity-it-consulting-limited",
      },
      {
        "id":27,
        "legal_name":"UKFast.Net Limited",
        "trading_name":"UKFast",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/2632/ukfastnet-limited",
      },
      {
        "id":28,
        "legal_name":"VODAFONE LIMITED",
        "trading_name":"",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/1482/vodafone-limited",
      },
      {
        "id":29,
        "legal_name":"Worldline IT Services UK Limited",
        "trading_name":"fuelGenie (Worldline IT Services UK Limited)",
        "size":"Large",
        "link": "https://www.crowncommercial.gov.uk/suppliers/722/worldline-it-services-uk-limited"
      },
      {
        "id":30,
        "legal_name":"Zellis UK Limited",
        "trading_name":"",
        "size":"SME",
        "link": "https://www.crowncommercial.gov.uk/suppliers/1225/zellis-uk-limited"
      }]
    const appendData = {
        data: cmsData,
        suppliers_list: supplierList,
        total_suppliers: 30
    }
    res.render('supplier', appendData)

}

export const POST_RFI_SUPPLIER = async (req: express.Request, res: express.Response) => {
  const { SESSION_ID } = req.cookies; //jwt
  const { eventId } = req.session;
  const response = await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/12`, 'Completed');
  if (response.status == HttpStatusCode.OK) {
     await TenderApi.Instance(SESSION_ID).put(`journeys/${eventId}/steps/13`, 'Not started');
  }

res.redirect('/rfi/response-date');

}

//agreement_suppliers_list