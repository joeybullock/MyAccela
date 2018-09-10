true ^ showDebug = false; showMessage = false;
{Land Development/Site Work Included} == "Yes" && appMatch("Building/Residential/*/*") ^ updateFee("SD01","SITEDEV", "FINAL", 1, "Y");
{Land Development/Site Work Included} == "Yes" && appMatch("Building/Multi Family/*/*") ^ updateFee("SD02","SITEDEV", "FINAL", 1, "Y");
{Land Development/Site Work Included} == "Yes" && appMatch("Building/Commercial/*/*") ^ updateFee("SD03","SITEDEV", "FINAL", 1, "Y");