true ^ showDebug = false; showMessage = false;
wfStatus == "Non-Compliant" ^ closeTask("Close","Close","Transferred to Code Compliance"); branch("WorkflowTaskUpdateAfter:Create Code Complaint");
wfStatus == "Route to NPU Supervisor" ^ closeTask("Close","Close","Transferred to Code Compliance"); branch("WorkflowTaskUpdateAfter:Create Code Complaint");