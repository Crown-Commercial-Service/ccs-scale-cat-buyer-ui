
$(document).ready(function () {

    const checkType = document.getElementById("rfi_offline_document");
    const elems = ['rfi', 'eoi','rfp','ca','da'];
    let foundElem = false;
    let type, uploadField;
    while (!foundElem && elems.length > 0) {
        type = elems.splice(0,1);
        uploadField = document.getElementById(`${type}_offline_document`);
        foundElem = !!uploadField;
    } 
    
    const FileMimeType = {
        "csv": "text/csv",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "jpg": "image/jpeg",
        "kml": "application/vnd.google-earth.kml+xml",
        "ods": "application/vnd.oasis.opendocument.spreadsheet",
        "odt": "application/vnd.oasis.opendocument.text",
        "pdf": "application/pdf",
        "png": "image/png",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "rdf": "application/rdf+xml", 
        "rtf": ["application/rtf","text/rtf"],
        "txt": "text/plain",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "xml": "text/xml", 
        "zip": ["application/x-zip-compressed","application/zip", "application/octet-stream", "multipart/x-zip", "application/zip-compressed"]
    } 
    
    if (uploadField != null && uploadField != undefined) {
        uploadField.onchange = function () {
            const FileList = this.files;
            const totalFiles = FileList.length;
            let totalFileSum = 0;

            for(var a =0; a < totalFiles; a ++){
                let file = FileList[a];
                totalFileSum = totalFileSum + file.size;
            }
        
            

            const allMimeTypes = Object.values(FileMimeType);
            const allValidMimeTypes = allMimeTypes.flat(1);
            const ErrorCheckArray = [];

            for(const file of FileList){

                console.log('*********************************filetype');
                console.log(file.type);

                const checkFileValidMimeType = allValidMimeTypes.filter(mimeType => mimeType === file.type).length > 0;

                let size = 300000000;
                
                if(file.size >= size){
                ErrorCheckArray.push({
                    type: "size"
                })
                    
                }
                else if(!checkFileValidMimeType){
                    let fileExt = file.name.split(".").pop();
                    fileExt = fileExt?fileExt:undefined;
                    if(fileExt == 'kml'){
                        ErrorCheckArray.push({
                            type: "none"
                        })
                    }else{
                        ErrorCheckArray.push({
                            type: "type"
                        })
                    }
                }
                else{
                ErrorCheckArray.push({
                    type: "none"
                })
                }

            }
            const removeErrorFieldsRfpScoreQuestion = () => {
                // $('.govuk-error-message').remove();
                $('.govuk-form-group--error').removeClass('govuk-form-group--error');
                $('.govuk-error-summary').remove();
                $('.govuk-input').removeClass('govuk-input--error');
                $('.govuk-form-group textarea').removeClass('govuk-textarea--error');
            }; 
            const noError = ErrorCheckArray.every(element => element.type === "none");
            const ErrorForSize = ErrorCheckArray.some(element => element.type === "size");
            const ErrorForMimeType = ErrorCheckArray.some(element => element.type === "type")
            let errorStore = [];
            let fieldCheck = '';
            if(noError){
                removeErrorFieldsRfpScoreQuestion();
                $(`#${type}_offline_document`).removeClass("govuk-input--error")
                $(`#upload_doc_form`).removeClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("");
                $(`.doc_upload_button`).show();
            }
            else if(ErrorForSize){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("Upload size exceeds 300 MB");
                $(`.doc_upload_button`).hide();
            }
            else if(ErrorForMimeType){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("The selected file must be csv, doc, docx, jpg, jpeg, kml, ods, odt, pdf, png, ppt, pptx, rdf, rtf, txt, xls, xlsx, xml, zip");
                fieldCheck = ['upload_doc_form', 'The selected file must be csv, doc, docx, jpg, jpeg, kml, ods, odt, pdf, png, ppt, pptx, rdf, rtf, txt, xls, xlsx, xml, zip'];
                errorStore.push(fieldCheck);
                ccsZPresentErrorSummary(errorStore);
                $(`.doc_upload_button`).hide();
            }
        
            else{
                $(`#${type}_offline_document`).removeClass("govuk-input--error")
                $(`#upload_doc_form`).removeClass("govuk-form-group--error");
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text("");
                $(`.doc_upload_button`).show();

            }


            if (Number(totalFileSum) > 1000000000){
                $(`#${type}_offline_document`).addClass("govuk-input--error")
                $(`#upload_doc_form`).addClass(`govuk-form-group--error`);
                $(`#${type}_offline_document`).val() === "";
                $(`#${type}_upload_error_summary`).text(`Total Files Size cannot exceed 1 GB`);
                $(`.doc_upload_button`).hide();
            }


        }
    }
});