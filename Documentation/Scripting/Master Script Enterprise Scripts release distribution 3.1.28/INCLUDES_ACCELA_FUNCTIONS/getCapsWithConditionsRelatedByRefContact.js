function getCapsWithConditionsRelatedByRefContact(itemCap,capType,pType,pStatus,pDesc,pImpact) {
	var matchingCapArray = new Array();
	var c = aa.people.getCapContactByCapID(itemCap).getOutput()
	for (var i in c)
		   {
		   var con = c[i];
		   if (con.getCapContactModel().getRefContactNumber())
		       {
			var p = con.getPeople();
			var psm = aa.people.createPeopleModel().getOutput()

			psm.setContactSeqNumber(con.getCapContactModel().getRefContactNumber());

			var cResult = aa.people.getCapIDsByRefContact(psm);  // needs 7.1
			if (cResult.getSuccess()) {
				var cList = cResult.getOutput();
				for (var j in cList) {
					var thisCapId = cList[j];
					if (appMatch(capType,thisCapId)) {
						if (pType==null)
							var condResult = aa.capCondition.getCapConditions(thisCapId);
						else
							var condResult = aa.capCondition.getCapConditions(thisCapId,pType);

						if (condResult.getSuccess())
							var capConds = condResult.getOutput();
						else
							{
							logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
							logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
							return false;
							}

						var cStatus;
						var cDesc;
						var cImpact;

						for (cc in capConds)
							{
							var thisCond = capConds[cc];
							var cStatus = thisCond.getConditionStatus();
							var cDesc = thisCond.getConditionDescription();
							var cImpact = thisCond.getImpactCode();
							var cType = thisCond.getConditionType();
							if (cStatus==null)
								cStatus = " ";
							if (cDesc==null)
								cDesc = " ";
							if (cImpact==null)
								cImpact = " ";
							//Look for matching condition

							if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
								matchingCapArray.push(thisCapId);
							}
						}
					}
				}
			}
		}
	}