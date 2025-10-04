var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var pmfDBName = "COLLEGE-DB";
var pmfRelationName = "PROJECT-TABLE";
var connToken = "90934969|-31949252738335409|90959822";

$("#pid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getPmfIdAsJsonObj() {
    var pid = $("#pid").val();
    var jsonStr = {
        id: pid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#pname").val(record.name);
    $("#assigned_to").val(record.assigned_to);
    $("#assigned_date").val(record.assigned_date);
    $("#deadline").val(record.deadline);
}

function resetForm() {
    $("#pid").val("");
    $("#pname").val("");
    $("#assigned_to").val("");
    $("#assigned_date").val("");
    $("#deadline").val("");
    $("#pid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#pid").focus();
}

function validateData() {
    var pid, pname, assigned_to, assigned_date, deadline;
    pid = $("#pid").val();
    pname = $("#pname").val();
    assigned_to = $("#assigned_to").val();
    assigned_date = $("#assigned_date").val();
    deadline = $("#deadline").val();

    if (pid == '') {
        alert("Project ID missing");
        $("#pid").focus();
        return "";
    }
    if (pname == '') {
        alert("Project Name missing");
        $("#pname").focus();
        return "";
    }
    if (assigned_to == '') {
        alert("Assigned To name is missing");
        $("#assigned_to").focus();
        return "";
    }
    if (assigned_date == '') {
        alert("Assigned Date is missing");
        $("#assigned_date").focus();
        return "";
    }
    if (deadline == '') {
        alert("Deadline Date is missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        id: pid,
        name: pname,
        assigned_to: assigned_to,
        assigned_date: assigned_date,
        deadline: deadline,
    };
    return JSON.stringify(jsonStrObj);
}

function getPmf() {
    var pIDJsonObj = getPmfIdAsJsonObj();
    var getRequset = createGET_BY_KEYRequest(connToken, pmfDBName, pmfRelationName, pIDJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequset, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status == 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#pname").focus();

    } else if (resJsonObj.status == 200) {

        $("#pid").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#pname").focus();

    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj == "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, pmfDBName, pmfRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 200) {
        alert("Saved Record successfully!");
    } else {
        alert("Failed to save record.");
        console.error(resJsonObj);
    }
    resetForm();
    $("#pid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonchg = validateData();

    var recno = localStorage.getItem("recno");
    if (!recno) {
        alert("Record number not found. Please re-enter Employee ID.");
        return;
    }

    var updateRequest = createUPDATERecordRequest(connToken, jsonchg, pmfDBName, pmfRelationName, recno);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 200) {
        alert("Record updated successfully!");
    } else {
        alert("Failed to update record.");
        console.error(resJsonObj);
    }

    resetForm();
    $("#pid").focus();
}
