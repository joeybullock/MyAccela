
function addAddressStdCondition(addNum,cType,cDesc)
	{

	var foundCondition = false;
	
	cStatus = "Applied";
	if (arguments.length > 3)
		cStatus = arguments[3]; // use condition status in args
		
	if (!aa.capCondition.getStandardConditions)
		{
		logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
		}
        else
		{
		standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
		for(i = 0; i<standardConditions.length;i++)
			if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
			{
			standardCondition = standardConditions[i]; // add the last one found
			
			foundCondition = true;
		
			if (!addNum) // add to all reference address on the current capId
				{
				var capAddResult = aa.address.getAddressByCapId(capId);
				if (capAddResult.getSuccess())
					{
					var Adds = capAddResult.getOutput();
					for (zz in Adds)
						{

						if (Adds[zz].getRefAddressId())
							{
							var addAddCondResult = aa.addressCondition.addAddressCondition(Adds[zz].getRefAddressId(),standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)
			
							if (addAddCondResult.getSuccess())
									{
									logDebug("Successfully added condition to reference Address " + Adds[zz].getRefAddressId() + " " + cDesc);
									}
								else
									{
									logDebug( "**ERROR: adding condition to reference Address " + Adds[zz].getRefAddressId() + " " + addAddCondResult.getErrorMessage());
									}
							}
						}
					}
				}
			else
				{
				var addAddCondResult = aa.addressCondition.addAddressCondition(addNum,standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)

					if (addAddCondResult.getSuccess())
						{
						logDebug("Successfully added condition to Address " + addNum + " " + cDesc);
						}
					else
						{
						logDebug( "**ERROR: adding condition to Address " + addNum + " " + addAddCondResult.getErrorMessage());
						}
				}
			}
		}
		
	if (!foundCondition) logDebug( "**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
	}

