{Total Principal Amount} != null ^ updateFee("PRINAMT","LIEN","FINAL",{Total Principal Amount},"N");
true ^ addrAddCondition("","Payment","Applied","Lien","A lien has been applied to this address and needs to be paid.","Notice","Y");
true ^ updateTask("Application Acceptance","Open"); closeTask("Application Acceptance","Open"); activateTask("Payment");
{FIFA Fee} != null ^ updateFee("FIFAFEE","LIEN","FINAL",{FIFA Fee},"N");
true ^ if({VPS Bills} == null) editAppSpecific("VPS Bills", 0); if({Water Bills} == null) editAppSpecific("Water Bills", 0); if({Misc Bills} == null) editAppSpecific("Misc Bills", 0); var vpsBills = parseFloat({VPS Bills}); var waterBills = parseFloat({Water Bills}); var miscBills = parseFloat({Misc Bills}); additionalBills = vpsBills + waterBills + miscBills;
!isNaN(additionalBills) ^ updateFee("BILLS","LIEN","FINAL",additionalBills,"N","N");