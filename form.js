
var formID = "1552";
var url = "//app-sj11.marketo.com";
var munchkinID = "306-DUP-745";

if(typeof marketoIDs === "undefined") {
    marketoIDs = {};
}
if(typeof marketoIDs[formID] === "undefined") {
    marketoIDs[formID] = formID;
    MktoForms2.loadForm(url, munchkinID, formID, function(form){
        if (form) {
            form.onSuccess(function (values, followUpUrl) {
                jQuery(this.formElem).trigger("ps.formSuccess");
                var redirectPath = "";
                var downloadPath = "";
                var successMessage = "\x3Ch3\x3EThank\x20you\x20for\x20subscribing\x3C\x2Fh3\x3E";
                var formID = "1552";
                //if file download
                if (downloadPath) {
                    var a = jQuery("<a>")
                            .attr("href", downloadPath)
                            .attr("download", "test-resource")
                            .appendTo("body");
                    a[0].click();
                    a.remove();
                }
                // Take the lead to a different page on successful submit, ignoring the form's configured followUpUrl
                if (redirectPath) {
                    location.href = redirectPath;
                    return false;
                }
                // replace the form with success message
                if (successMessage) {
                    this.formElem.replaceWith("<div class='marketo-form__success-message form-" + formID + "'>" + successMessage + "</div>");
                    return false;
                }
            });

            form.onValidate(function (isValid) {
                if (isValid) {
                    jQuery(this.formElem).trigger("ps.formValid");
                } else {
                    jQuery(this.formElem).trigger("ps.formInvalid");
                }
            });
        }
    });
    MktoForms2.whenReady(function(form) {
        jQuery(form.getFormElem()).trigger("ps.formRendered");
    });
}
