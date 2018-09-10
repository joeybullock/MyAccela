function copyASIFields(sourceCapId,targetCapId)  // optional groups to ignore
	{
	var ignoreArray = new Array();
	for (var i=2; i<arguments.length;i++)
		ignoreArray.push(arguments[i])

	var targetCap = aa.cap.getCap(targetCapId).getOutput();
	var targetCapType = targetCap.getCapType();
	var targetCapTypeString = targetCapType.toString();
	var targetCapTypeArray = targetCapTypeString.split("/");

	var sourceASIResult = aa.appSpecificInfo.getByCapID(sourceCapId)

	if (sourceASIResult.getSuccess())
		{ var sourceASI = sourceASIResult.getOutput(); }
	else
		{ aa.print( "**ERROR: getting source ASI: " + sourceASIResult.getErrorMessage()); return false }

	for (ASICount in sourceASI)
		  {
		  thisASI = sourceASI[ASICount];

		  if (!exists(thisASI.getCheckboxType(),ignoreArray))
		       {
		       thisASI.setPermitID1(targetCapId.getID1())
		       thisASI.setPermitID2(targetCapId.getID2())
		       thisASI.setPermitID3(targetCapId.getID3())
		       thisASI.setPerType(targetCapTypeArray[1])
		       thisASI.setPerSubType(targetCapTypeArray[2])
		       aa.cap.createCheckbox(thisASI)
		       }
  		  }
	}

