true ^ showDebug = false; showMessage = true;
true ^ branch ("CMN:Building/*/*/*:Inspection Workflow Update");
true ^ branch ("CMN:Building/*/*/*:Inspection Create Arborist Illegal");
(appMatch("Building/*/*/*")) ^ branch ("CMN:Building/*/*/*:Reinspection Fee");
appMatch("Building/Commercial/Electrical/*") || appMatch("Building/Commercial/HVAC/*") || appMatch("Building/Commercial/Low Voltage/*") || appMatch("Building/Commercial/Plumbing/*") || appMatch("Building/Residential/Electrical/*") || appMatch("Building/Residential/HVAC/*") || appMatch("Building/Residential/Low Voltage/*") || appMatch("Building/Residential/Plumbing/*") ^ branch ("CMN:Building/*/*/*:Technical Inspection Updates and Fees");