true ^ showDebug = false; showMessage = true;
wfTask == "Application Intake" && wfStatus == "Accepted" && balanceDue > 0 ^ message="Workflow Task Can't Be Updated Because " + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
wfTask == "Urban Design Commission" && wfStatus == "Approved" && balanceDue > 0 ^ message="Workflow Task Can't Be Updated Because " + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
balanceDue > 0 ^ message="Workflow Task Can't Be Updated Because " + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true