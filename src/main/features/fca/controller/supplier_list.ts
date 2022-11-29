import * as express from 'express';
import * as cmsData from '../../../resources/content/procurement/mcf3_supplierlist.json';
import { GetLotSuppliers } from '../../shared/supplierService';
import config from 'config';
var { Parser } = require("json2csv");
import { TenderApi } from '@common/util/fetch/procurementService/TenderApiInstance';
import * as supplierIDSData from '../../../resources/content/fca/shortListed.json';

/**
 *
 * @Rediect
 * @param req
 * @param res
 *
 *
 */
 export const SUPPLIER_LIST = async (req: express.Request, res: express.Response) => {
   const { SESSION_ID } = req.cookies;
   const { projectId ,eventId} = req.session;
   const { agreement_id } = req.session;
   try {
    let conditionForHeaderAgreement = false;
   if(req.query.lot !== undefined) {
    req.session.lotId = req.query.lot;
    req.session.agreement_id = req.query.agreement;
    conditionForHeaderAgreement = true;
   }
  let lotid=req.session.lotId;
  lotid=lotid.replace('Lot ','')
  const lotSuppliers = config.get('CCS_agreements_url')+req.session.agreement_id+":"+lotid+"/lot-suppliers";
  const downloadSuppliers=process.env['AGREEMENTS_SERVICE_API_URL']+'/agreements/'+req.session.agreement_id+'/lots/'+lotid+'/suppliers/export';
  
  const releatedContent = req.session.releatedContent;
  const { download,previous, next } = req.query

  // const supplierURL=`/tenders/projects/${projectId}/events/${eventId}/suppliers`;
  //   const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(supplierURL);

  //   const suppliersList=suppliers.suppliers;
  //const suppliersList = await GetLotSuppliers(req);


    /*patch */ // LATEST
    const MatchedSupplierIDS : any = [];

    //let suppliersList = [];
    //suppliersList = await GetLotSuppliers(req);
    let supplierList = [];
    if(agreement_id == 'RM6187') {

      const supplierURL=`/tenders/projects/${projectId}/events/${eventId}/suppliers`;
    const { data: suppliers } = await TenderApi.Instance(SESSION_ID).get(supplierURL);

    const suppliersList=suppliers.suppliers;
for(let i=0;i<suppliersList.length;i++){
     
      if(supplierIDSData['supplierIDS'].includes(suppliersList[i].id)) 
      MatchedSupplierIDS.push(suppliersList[i].id);
    }

    //   suppliersList = suppliersList.filter((el: any) => {

    //         if(supplierIDSData['supplierIDS'].includes(el.organization.id)) {
    //         MatchedSupplierIDS.push(el.organization.id);
    // }

    //   });   
      //END

    // for(let i=0;i<suppliersList.length;i++){
     
    //  // if(supplierIDSData['supplierIDS'].includes(suppliersList[i].id)) 
    //   MatchedSupplierIDS.push(suppliersList[i].id);
    // }

    const UnqMatchedSupplierIDS = MatchedSupplierIDS.filter((value:any, index:any, self:any) => {
      return self.indexOf(value) === index;
    });
    
    /*patch */
    
      supplierList = await GetLotSuppliers(req);
  
      supplierList = supplierList.filter((el: any) => {
        if(UnqMatchedSupplierIDS.includes(el.organization.id)) {
          return true;
        }
        return false;
      });
    }else{
      supplierList = await GetLotSuppliers(req);
    }
    
  const rowCount=10;let showPrevious=false,showNext=false;
  supplierList = supplierList.sort((a: any, b: any) => a.organization.name.replace("-"," ").toLowerCase() < b.organization.name.replace("-"," ").toLowerCase() ? -1 : a.organization.name.replace("-"," ").toLowerCase() > b.organization.name.replace("-"," ").toLowerCase() ? 1 : 0);
  const supplierListDwn = supplierList;
  const supplierLength = supplierList.length;
  
  let appendData;
  let noOfPages=Math.ceil(supplierList.length/rowCount);
  
  if(previous==undefined && next==undefined)
      {
        
        req.session.supplierpagenumber = 1;
        if(supplierList.length <= rowCount) {
          
          showPrevious = false;
          showNext = false;

           appendData = {
            data: cmsData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            downloadSuppliers:downloadSuppliers,
            lotId:req.session.lotId,
            agreementLotName:req.session.agreementLotName,
            showPrevious,
            showNext,
            supplierLength,
            agreementid:req.session.agreement_id,
            conditionForHeaderAgreement: conditionForHeaderAgreement
          };


        } else {
          
          showPrevious=false;
          showNext=true;
          supplierList = supplierList.slice(0,rowCount);

           appendData = {
            data: cmsData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            downloadSuppliers:downloadSuppliers,
            lotId:req.session.lotId,
            agreementLotName:req.session.agreementLotName,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:1,
            noOfPages,
            agreementid:req.session.agreement_id,
            conditionForHeaderAgreement: conditionForHeaderAgreement
          };
        }


        



      } else {
        if(previous!=undefined) {
            let currentpagenumber=req.session.supplierpagenumber;
            let previouspagenumber=currentpagenumber-1;
          
            if(previouspagenumber<1){
              previouspagenumber=1;
              currentpagenumber=previouspagenumber+1;
             }

            let lastindex=previouspagenumber*rowCount;
            supplierList=supplierList.slice(lastindex-rowCount,lastindex);
            req.session.supplierpagenumber=previouspagenumber;
            if(previouspagenumber == 1) {
              showPrevious=false;
            } else {
              showPrevious=true;
            }
            showNext=true;

             appendData = {
              data: cmsData,
              suppliers_list: supplierList,
              lotSuppliers: lotSuppliers,
              releatedContent: releatedContent,
              downloadSuppliers:downloadSuppliers,
              lotId:req.session.lotId,
              agreementLotName:req.session.agreementLotName,
              showPrevious,
              showNext,
              supplierLength,
              currentpagenumber:previouspagenumber,
              noOfPages,
              agreementid:req.session.agreement_id,
              conditionForHeaderAgreement: conditionForHeaderAgreement
            };
        } else {  //next is undefined
          
          let currentpagenumber=req.session.supplierpagenumber;
          
          let nextpagenumber=currentpagenumber+1;
          
          if(nextpagenumber>noOfPages){
           nextpagenumber=noOfPages;
           currentpagenumber=nextpagenumber-1;
          }
          let lastindex=nextpagenumber*rowCount;

          let firstindex=0;
          if(lastindex > supplierList.length) {
            lastindex=supplierList.length;
            firstindex=currentpagenumber*rowCount;
          
          } else {
            firstindex=lastindex-rowCount;
            
          }
          
          supplierList=supplierList.slice(firstindex,lastindex);
          
          req.session.supplierpagenumber=nextpagenumber;
          
          if(nextpagenumber==noOfPages) {
            showNext=false;
          } else {
            showNext=true;
          }

          
          showPrevious=true;
           appendData = {
            data: cmsData,
            suppliers_list: supplierList,
            lotSuppliers: lotSuppliers,
            releatedContent: releatedContent,
            downloadSuppliers:downloadSuppliers,
            lotId:req.session.lotId,
            agreementLotName:req.session.agreementLotName,
            showPrevious,
            showNext,
            supplierLength,
            currentpagenumber:nextpagenumber,
            noOfPages,
            agreementid:req.session.agreement_id,
            conditionForHeaderAgreement: conditionForHeaderAgreement
          };
        }
      }

     
      if(download!=undefined)
      {
        const JsonData:any = [];
        let contactSupplierDetails;
     
        for(let i=0;i<supplierListDwn.length;i++){
          const contact = supplierListDwn[i];
          let contactData:any = [];
          // if(contact.lotContacts != undefined) {
            // contact.lotContacts[0].contact['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
            // contact.lotContacts[0].contact['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
            // contact.lotContacts[0].contact['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
            // contact.lotContacts[0].contact['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
            // contact.lotContacts[0].contact['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
            // contactData['name'] = contact.organization?.name == undefined?'-': contact.organization.name;
            // contactData['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
            // contactData['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
            // contactData['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
            // contactData['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
           // contactSupplierDetails = contactData;

            contactData['Contact name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
            contactData['Contact email'] = contact?.organization?.contactPoint?.email == undefined?'-': contact?.organization?.contactPoint?.email;
            contactData['Contact phone number'] = contact?.organization?.contactPoint?.telephone == undefined?'-': contact?.organization?.contactPoint?.telephone;
            contactData['Supplier id'] = contact.organization?.name == undefined?'-': contact.organization.id;
            contactData['Registered company name'] = contact.organization?.name == undefined?'-': contact.organization.name;
            const streetAddress = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
            const locality = contact?.organization?.address?.locality == undefined?'-': contact?.organization?.address?.locality;
            
            const postalCode = contact?.organization?.address?.postalCode == undefined?' ': contact?.organization?.address?.postalCode;
            const countryName = contact?.organization?.address?.countryName == undefined?' ': contact?.organization?.address?.countryName;
            const countryCode = contact?.organization?.address?.countryCode == undefined?' ': contact?.organization?.address?.countryCode;
            
            contactData['Registered company address'] = streetAddress+" "+locality+" "+postalCode+" "+countryName+" "+countryCode;
            contactData['Url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
            contactData['Status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
            
            // contactData['status'] = contact?.supplierStatus == undefined?'-':contact?.supplierStatus;
            // contactData['address'] = contact?.organization?.address?.streetAddress == undefined?'-': contact?.organization?.address?.streetAddress;
            // contactData['Contact Point name'] = contact?.organization?.contactPoint?.name == undefined?'-': contact?.organization?.contactPoint?.name;
            // contactData['url'] = contact.organization?.identifier?.uri == undefined?'-': contact.organization?.identifier?.uri;
             contactSupplierDetails = contactData;

          // }
          JsonData.push(contactSupplierDetails)
        }
    
       // let fields = ["Supplier name","email","telephone","address","url","Contact Point name"];
        let fields = ["Contact name","Contact email","Contact phone number","Supplier id","Registered company name","Registered company address","Url","Status"];
       
       const json2csv = new Parser({fields});
        const csv = json2csv.parse(JsonData);
        res.header('Content-Type', 'text/csv');
        res.attachment("FCA_AllSuppliers_List.csv");         
        res.send(csv);
    
      }else{
        res.render('fca_supplier_list',appendData );
      }

    } catch(err) {
      console.log(err)
    }

 }