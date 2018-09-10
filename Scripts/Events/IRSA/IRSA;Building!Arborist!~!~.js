true ^ showDebug = false; showMessage = true;
true ^ branch ("CMN:Building/Arborist/*/*:Inspection Workflow Update");
appMatch("Building/Arborist/Complaint/*") ^ branch ("CMN:Building/Arborist/Complaint/*:Inspection Workflow Update");
appMatch("Building/Arborist/Illegal Activity/*") ^ branch ("CMN:Building/Arborist/Illegal Activity/*:Inspection Workflow Update");