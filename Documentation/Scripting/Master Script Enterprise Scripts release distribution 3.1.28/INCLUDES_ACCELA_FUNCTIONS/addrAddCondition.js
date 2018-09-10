function addrAddCondition(pAddrNum, pType, pStatus, pDesc, pComment, pImpact, pAllowDup)
	{
	//if pAddrNum is null, condition is added to all addresses on CAP
	//06SSP-00223
	//
	if (pAllowDup=="Y")
		var noDup = false;
	else
		var noDup = true;
		
	var condAdded = false;
		
	if (!pAddrNum) //no address num, add condition to all addresses on CAP
		{
		var capAddrResult = aa.address.getAddressByCapId(capId);
		if (capAddrResult.getSuccess())
			{
			var addCondResult;
			var addCondResult2;
			var getCondResult;
			var condArray;
			var addresses = capAddrResult.getOutput();
			
			addCondLoop:  //loop identifier
			for (zz in addresses)
				{
				var addrRefId = addresses[zz].getRefAddressId();
				if (addrRefId==null)
					{
					logDebug("No reference address ID found for Address "+zz);
					continue;
					}
					
				if (noDup) //Check if this address has duplicate condition
					{
					var cType;
					var cStatus;
					var cDesc;
					var cImpact;
					
					getCondResult = aa.addressCondition.getAddressConditions(addrRefId);
					condArray = getCondResult.getOutput();
					if (condArray.length>0)
						{
						for (bb in condArray)
							{
							cType = condArray[bb].getConditionType();
							cStatus = condArray[bb].getConditionStatus();
							cDesc = condArray[bb].getConditionDescription();
							cImpact = condArray[bb].getImpactCode();
							if (cType==null)
								cType = " ";
							if (cStatus==null)
								cStatus = " ";
							if (cDesc==null)
								cDesc = " ";
							if (cImpact==null)
								cImpact = " ";
							if ( (pType==null || pType.toUpperCase()==cType.toUpperCase()) && (pStatus==null || pStatus.toUpperCase()==cStatus.toUpperCase()) && (pDesc==null || pDesc.toUpperCase()==cDesc.toUpperCase()) && (pImpact==null || pImpact.toUpperCase()==cImpact.toUpperCase()) )
								{
								logMessage("Condition already exists: New condition not added to Address ID "+addrRefId);
								logDebug("Condition already exists: New condition not added to Address ID "+addrRefId);
								continue addCondLoop; //continue to next address without adding condition
								}
							}
						}
					}
					
				logDebug("Adding Condition to address " + zz + " = " + addrRefId);
				addCondResult = aa.addressCondition.addAddressCondition(addrRefId, pType, pDesc, pComment, null, null, pImpact, pStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
				if (addCondResult.getSuccess())
					{
					logMessage("Successfully added condition to Address ID " + addrRefId + "  (" + pImpact + ") " + pDesc);
					logDebug("Successfully added condition to Address ID " + addrRefId + "  (" + pImpact + ") " + pDesc);
					condAdded=true;
					}
				else
					{
					logDebug( "**ERROR: adding condition to Address " + addrRefId + "  (" + pImpact + "): " + addCondResult.getErrorMessage());
					}
				}
			}
		}
	else //add condition to specified address only
		{
		if (noDup) //Check if this address has duplicate condition
			{
			var cType;
			var cStatus;
			var cDesc;
			var cImpact;
			
			getCondResult = aa.addressCondition.getAddressConditions(pAddrNum);
			condArray = getCondResult.getOutput();
			if (condArray.length>0)
				{
				for (bb in condArray)
					{
					cType = condArray[bb].getConditionType();
					cStatus = condArray[bb].getConditionStatus();
					cDesc = condArray[bb].getConditionDescription();
					cImpact = condArray[bb].getImpactCode();
					if (cType==null)
						cType = " ";
					if (cStatus==null)
						cStatus = " ";
					if (cDesc==null)
						cDesc = " ";
					if (cImpact==null)
						cImpact = " ";
					if ( (pType==null || pType.toUpperCase()==cType.toUpperCase()) && (pStatus==null || pStatus.toUpperCase()==cStatus.toUpperCase()) && (pDesc==null || pDesc.toUpperCase()==cDesc.toUpperCase()) && (pImpact==null || pImpact.toUpperCase()==cImpact.toUpperCase()) )
						{
						logMessage("Condition already exists: New condition not added to Address ID "+pAddrNum);
						logDebug("Condition already exists: New condition not added to Address ID "+pAddrNum);
						return false;
						}
					}
				}
			}
		var addCondResult = aa.addressCondition.addAddressCondition(pAddrNum, pType, pDesc, pComment, null, null, pImpact, pStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
	  if (addCondResult.getSuccess())
		  {
			logMessage("Successfully added condition to Address ID " + pAddrNum + "  (" + pImpact + ") " + pDesc);
			logDebug("Successfully added condition to Address ID " + pAddrNum + "  (" + pImpact + ") " + pDesc);
			condAdded=true;
			}
		else
			{
			logDebug( "**ERROR: adding condition to Address " + pAddrNum + "  (" + pImpact + "): " + addCondResult.getErrorMessage());
			}
		}
	return condAdded;
	}

