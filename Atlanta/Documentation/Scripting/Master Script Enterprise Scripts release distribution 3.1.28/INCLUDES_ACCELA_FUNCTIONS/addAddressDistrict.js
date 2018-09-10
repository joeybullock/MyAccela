function addAddressDistrict(addrNum, districtValue)
//if addrNum is null, district is is added to all addresses on the Record
	{
	if (!addrNum)
		{
		var capAddrResult = aa.address.getAddressByCapId(capId);
		if (capAddrResult.getSuccess())
			{
			var addrs = capAddrResult.getOutput();
			for (var zz in addrs)
				{
				apdResult = aa.address.addAddressDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),addrs[zz].getAddressId(),districtValue);
				
				if (!apdResult.getSuccess())
					{ logDebug("**ERROR Adding District " + districtValue + " to address #" + addrs[zz].getAddressId() + " : " + apdResult.getErrorMessage()) ; return false ; }
				else
					logDebug("Successfully added district " + districtValue + " to address #" + addrs[zz].getAddressId());

				}
			}
		}
	else
		{
		apdResult = aa.address.addAddressDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),addrNum,districtValue);

		if (!apdResult.getSuccess())
			{ logDebug("**ERROR Adding District " + districtValue + " to address #" + addrNum + " : " + apdResult.getErrorMessage()) ; return false ; }
		else
			logDebug("Successfully added district " + districtValue + " to address #" + addrNum);
		}
	}
