function FileUploadMobile(fileInput, newButton, fileImageForm, url, uploadStart, uploadProgressCB, uploadFailedCB, uploadCanceledCB, uploadCompleteCB) {
    $('#' + newButton).bind('click', function () {
        $('#' + fileInput).trigger('click');
    });
    this.files = null;
    this.index = 0;
    var element = document.getElementById(fileInput);
    handleFileEvent(true);
    function handleFileEvent(isAdd) {
        if (isAdd) {
            if ("\v" == "v") {
                element.onpropertychange = uploadHandle;
            }
            else {
                element.addEventListener("change", uploadHandle, false);
            }
        } else {
            if ("\v" == "v") {
                element.onpropertychange = null;
            }
            else {
                element.removeEventListener("change", uploadHandle, false);
            }
        }
    }

    function uploadComplete(evt) {
        var data = evt.target.responseText;
        uploadCompleteCB(index, data, evt);
        index++;
        if (index < files.length) {
            uploadFileHandle();
        }
        else {
            files = null;
            index = 0;
        }
    }

    function uploadProgress(evt) {
        uploadProgressCB(index, evt);
    }

    function uploadFailed(evt) {
        var data = evt.target.responseText;
        uploadFailedCB(index, evt);
    }

    function uploadCanceled(evt) {
        var data = evt.target.responseText;
        uploadCanceledCB(index, evt);
    }

    function uploadHandle() {
        files = new Array();
        for (var i = 0; i < element.files.length; i++) {
            files.push(element.files[i]);
        }
        index = 0;
        handleFileEvent(false);
        var formObj = document.getElementById(fileImageForm);
        formObj.reset();
        handleFileEvent(true);
        var result = uploadStart(files);
        if (typeof(result) == "undefined") {
            uploadFileHandle();
        }
        else if (result) {
            uploadFileHandle();
        }
        else {
        }
    }

    function uploadFileHandle() {
        var fd = new FormData();
        fd.append('Filedata', files[index]);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", url);
        xhr.send(fd);
    }
};