showMessage = false; showDebug = false;
inspType == "190 Building Final" && (isTaskStatus("Arborist Review","Approved") || isTaskStatus("Arborist Final Review","Approved")) && !checkInspectionResult("590 Arborist Final","Passed") ^ message+="<br>Cannot schedule a Building Final until it has passed an Arborist Final inspection."; showMessage = true; cancel = true;
