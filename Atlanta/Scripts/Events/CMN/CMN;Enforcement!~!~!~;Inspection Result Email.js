true ^ showDebug = false; showMessage = false;
true ^ sendToAddress = null
inspType != null ^ sendToAddress = "hutz@AtlantaGa.Gov"
^ emailSubject = " Code Enforcement Inspection Result Case = " + capIDString
^ emailText = "CapId = " + capIDString + "\n"
^ emailText = "<B>INSPECTION RESULT: </B>" + inspResult
^ emailContact(emailSubject, emailText,"Violator");
sendToAddress != null ^ aa.sendMail("hutz@AtlantaGa.Gov", sendToAddress, "", emailSubject, emailText);