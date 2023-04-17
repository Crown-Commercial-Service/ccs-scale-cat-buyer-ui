//@ts-nocheck
import config from 'config';
import moment from 'moment-business-days';

export function getResponseDate(){
    const predefinedDays = {
        defaultEndingHour: Number(config.get('predefinedDays.defaultEndingHour')),
        defaultEndingMinutes: Number(config.get('predefinedDays.defaultEndingMinutes')),
        clarification_days: Number(config.get('predefinedDays.clarification_days')),
        clarification_period_end: Number(config.get('predefinedDays.clarification_period_end')),
        supplier_period: Number(config.get('predefinedDays.supplier_period')),
        supplier_deadline: Number(config.get('predefinedDays.supplier_deadline')),
      };


      const rfi_clarification_dateNew = new Date();
      rfi_clarification_dateNew.setHours(predefinedDays.defaultEndingHour);
      rfi_clarification_dateNew.setMinutes(predefinedDays.defaultEndingMinutes);
     // const rfi_clarification_date = moment(new Date(rfi_clarification_dateNew), 'DD/MM/YYYY').format('DD MMMM YYYY,HH:mm');
      

     let rfi_clarification_date= moment(
      rfi_clarification_dateNew,
      'DD/MM/YYYY, HH:mm',
    ).format('DD MMMM YYYY, HH:mm'
    )
     
       const clarification_period_end_date = new Date();
       const clarification_period_end_date_parsed = `${clarification_period_end_date.getDate()}-${clarification_period_end_date.getMonth() + 1
         }-${clarification_period_end_date.getFullYear()}`;
       const rfi_clarification_period_end = moment(clarification_period_end_date_parsed, 'DD MM YYYY').businessAdd(
         predefinedDays.clarification_days,
       )._d;
       rfi_clarification_period_end.setHours(predefinedDays.defaultEndingHour);
       rfi_clarification_period_end.setMinutes(predefinedDays.defaultEndingMinutes);
         console.log("rfi_clarification_period_end",rfi_clarification_period_end);
       const DeadlinePeriodDate = rfi_clarification_period_end;
 
       const DeadlinePeriodDate_Parsed = `${DeadlinePeriodDate.getDate()}-${DeadlinePeriodDate.getMonth() + 1
         }-${DeadlinePeriodDate.getFullYear()}`;
       const deadline_period_for_clarification_period = moment(DeadlinePeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
         predefinedDays.clarification_period_end,
       )._d;
       deadline_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
       deadline_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
       console.log("deadline_period_for_clarification_period",deadline_period_for_clarification_period);
 
       const SupplierPeriodDate = deadline_period_for_clarification_period;
       const SupplierPeriodDate_Parsed = `${SupplierPeriodDate.getDate()}-${SupplierPeriodDate.getMonth() + 1
         }-${SupplierPeriodDate.getFullYear()}`;
       const supplier_period_for_clarification_period = moment(SupplierPeriodDate_Parsed, 'DD-MM-YYYY').businessAdd(
         predefinedDays.supplier_period,
       )._d;
       supplier_period_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
       supplier_period_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
 
       const SupplierPeriodDeadLine = supplier_period_for_clarification_period;
       const SupplierPeriodDeadLine_Parsed = `${SupplierPeriodDeadLine.getDate()}-${SupplierPeriodDeadLine.getMonth() + 1
         }-${SupplierPeriodDeadLine.getFullYear()}`;
       const supplier_dealine_for_clarification_period = moment(SupplierPeriodDeadLine_Parsed, 'DD-MM-YYYY').businessAdd(
         predefinedDays.supplier_deadline,
       )._d;
       supplier_dealine_for_clarification_period.setHours(predefinedDays.defaultEndingHour);
       supplier_dealine_for_clarification_period.setMinutes(predefinedDays.defaultEndingMinutes);
      
       let formet_rfi_clarification_period_end = moment(
        rfi_clarification_period_end,
        'DD/MM/YYYY, HH:mm',
      ).format('DD MMMM YYYY, HH:mm');

      let formet_deadline_period_for_clarification_period = moment(
        deadline_period_for_clarification_period,
        'DD/MM/YYYY, HH:mm',
      ).format('DD MMMM YYYY, HH:mm');

      
       let formet_supplier_period_for_clarification_period = moment(
        supplier_period_for_clarification_period,
        'DD/MM/YYYY, HH:mm',
      ).format('DD MMMM YYYY, HH:mm');

      
      let formet_supplier_dealine_for_clarification_period = moment(
        supplier_dealine_for_clarification_period,
        'DD/MM/YYYY, HH:mm',
      ).format('DD MMMM YYYY, HH:mm');

      

       const responseDateData = {
         responseDateWithQuestion :{ "rfi_clarification_date":`Question 1*${rfi_clarification_dateNew}`,
         "rfi_clarification_period_end":`Question 2*${rfi_clarification_period_end}`,
         "deadline_period_for_clarification_period":`Question 3*${deadline_period_for_clarification_period}`,
         "supplier_period_for_clarification_period":`Question 4*${supplier_period_for_clarification_period}`,
         "supplier_dealine_for_clarification_period":`Question 5*${supplier_dealine_for_clarification_period}`
       },
      
       responseDate :{ "rfi_clarification_date":`Question 1*${rfi_clarification_date}`,
       "rfi_clarification_period_end":`Question 2*${formet_rfi_clarification_period_end}`,
       "deadline_period_for_clarification_period":`Question 3*${formet_deadline_period_for_clarification_period}`,
       "supplier_period_for_clarification_period":`Question 4*${formet_supplier_period_for_clarification_period}`,
       "supplier_dealine_for_clarification_period":`Question 5*${formet_supplier_dealine_for_clarification_period}`
     },
     
        }
        

         return responseDateData;
}