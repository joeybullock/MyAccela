true ^ showDebug = false; showMessage = true;
appMatch("Building/Multi Family/Land Development/*") ^ updateFee("SD02","SITEDEV", "FINAL", 1, "Y");
appMatch("Building/Commercial/Land Development/*") ^ updateFee("SD03","SITEDEV", "FINAL", 1, "Y");
appMatch("Building/Plans Subdivision/*/*") ^ updateFee("SD03","SITEDEV", "FINAL", 1, "Y");
appMatch("Building/Subdivision/*/*") ^ updateFee("SD03","SITEDEV", "FINAL", 1, "Y");
true ^ updateFee("BTECH","BUILDING","FINAL",1 ,"Y");