/**
 * 
 * @param fieldName | form field name
 * @param message | error message
 * @returns error object
 */
export const genarateFormValidation = (fieldName : any, message : string)=> {
  return  {
        summary: [
          {
            id: fieldName,
            href: `#${fieldName}`,
            text: message
          }
        ],
        inline: {
            [fieldName]: {
            id: fieldName,
            href: `#${fieldName}`,
            text: message
          }
        },
        text: { [fieldName]: message },
        hasErrors: true
      }
 }