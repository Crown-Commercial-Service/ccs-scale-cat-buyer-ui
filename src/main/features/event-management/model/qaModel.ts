export interface QuestionAndAnswer {
    id:         string;
    question:       string;
    answer:     string;
    created: string;
    create_question_input:           string;
    create_clarification_input:           string;
    IsquestionNotDefined:     boolean;
    IsclarificationNotDefined:            boolean;
    questionErrorMessage:     string;
    clarificationErrorMessage:            string;
    questionErrorMessage_count:     string;
    clarificationErrorMessage_count:            string;
    clarification_count :boolean;
    Question_count:boolean;
}