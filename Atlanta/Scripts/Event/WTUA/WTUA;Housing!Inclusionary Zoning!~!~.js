true ^ showDebug = false; showMessage = false;
wfTask == "Inclusionary Zoning Review" && wfStatus == "Invoice In-Lieu Fee" ^ editAppSpecific("In-Lieu Fee Applied","Yes"); branch("CMN:Housing/Inclusionary Zoning/*/*:Assess Fees");
wfTask == "Inclusionary Zoning Review" || wfTask == "Compliance Sign Off" ^ branch("CMN:Housing/Inclusionary Zoning/*/*:Parent IZ Update");