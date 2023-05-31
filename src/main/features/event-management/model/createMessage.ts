export interface CreateMessage {
  create_message: string[];
  create_message_input: string;
  create_subject_input: string;
  IsSupplierNotDefined: boolean;
  IsClassificationNotDefined: boolean;
  IsSubjectNotDefined: boolean;
  IsMessageNotDefined: boolean;
  classificationErrorMessage: string;
  subjectErrorMessage: string;
  messageErrorMessage: string;
  selected_message: string;
  create_supplier_message: any;
}
