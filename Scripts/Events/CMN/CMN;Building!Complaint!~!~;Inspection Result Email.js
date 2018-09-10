true ^ showDebug = true; showMessage = true;
true ^ sendToAddress = null
//inspType != null ^ sendToAddress = "rcamp@AtlantaGa.Gov"
^ emailSubject = " Buildings Complaint Inspection Result Case = " + capIDString
^ emailText = "CapId = " + capIDString + "\n"
^ emailText = "<B>INSPECTION RESULT: </B>" + inspResult
emailContact(emailSubject, emailText,"Complainant");
//sendToAddress ^ aa.sendMail("rcamp@AtlantaGa.Gov", sendToAddress, "", emailSubject, emailText);