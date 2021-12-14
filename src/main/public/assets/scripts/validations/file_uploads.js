
$(document).ready(function () {

    var uploadField = document.getElementById("rfi_offline_document");
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
        "rtf": "application/rtf",
        "txt": "text/plain",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "xml": "application/xml", 
        "zip": "application/zip"
    } 
    

    uploadField.onchange = function () {
        const FileList = this.files;

        const allValidMimeTypes = Object.values(FileMimeType);
        const ErrorCheckArray = [];

        for(const file of FileList){

            const checkFileValidMimeType = allValidMimeTypes.filter(mimeType => mimeType === file.type).length > 0;
            
            if(file.size > 1000000){
               ErrorCheckArray.push({
                   type: "size"
               })
                
            }
            else if(!checkFileValidMimeType){
               ErrorCheckArray.push({
                   type: "type"
               })
            }
            else{
               ErrorCheckArray.push({
                   type: "none"
               })
            }

        }

        const noError = ErrorCheckArray.every(element => element.type === "none");
        const ErrorForSize = ErrorCheckArray.some(element => element.type === "size");
        const ErrorForMimeType = ErrorCheckArray.some(element => element.type === "type")
        if(noError){
            $('#rfi_offline_document').removeClass("govuk-input--error")
            $('#upload_doc_form').removeClass('govuk-form-group--error');
            $('#rfi_offline_document').val() === "";
            $('#rfi_upload_error_summary').text('');
            $('.doc_upload_button').show();
        }
        else if(ErrorForSize){
            $('#rfi_offline_document').addClass("govuk-input--error")
            $('#upload_doc_form').addClass('govuk-form-group--error');
            $('#rfi_offline_document').val() === "";
            $('#rfi_upload_error_summary').text('Upload size exceeds 1 GB');
            $('.doc_upload_button').hide();
        }
        else if(ErrorForMimeType){
            $('#rfi_offline_document').addClass("govuk-input--error")
            $('#upload_doc_form').addClass('govuk-form-group--error');
            $('#rfi_offline_document').val() === "";
            $('#rfi_upload_error_summary').text('Acceptable file formats:  csv, doc, docx, jpg, kml, ods, odt, pdf, png, ppt, pptx, rdf, rtf, txt, xls, xlsx, xml, zip');
            $('.doc_upload_button').hide();
        }
        else{
            $('#rfi_offline_document').removeClass("govuk-input--error")
            $('#upload_doc_form').removeClass('govuk-form-group--error');
            $('#rfi_offline_document').val() === "";
            $('#rfi_upload_error_summary').text('');
            $('.doc_upload_button').show();

        }



    }

});