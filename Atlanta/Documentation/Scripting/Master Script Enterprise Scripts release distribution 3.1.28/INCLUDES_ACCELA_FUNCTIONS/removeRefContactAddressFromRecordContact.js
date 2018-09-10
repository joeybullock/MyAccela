function removeRefContactAddressFromRecordContact(itemCap,cSeqNumber,rConAddrModel) {

	if (itemCap && cSeqNumber && rConAddrModel) {
		var xRefContactAddress = aa.address.createXRefContactAddressModel().getOutput();
		xRefContactAddress.setCapID(itemCap);
		xRefContactAddress.setAddressID(rConAddrModel.getAddressID());
		// Set the daily contact id to xRefContactAddress model
		xRefContactAddress.setEntityID(aa.util.parseLong(cSeqNumber));
		xRefContactAddress.setEntityType(rConAddrModel.getEntityType());
		// Create
		var xrefResult = aa.address.deleteXRefContactAddress(xRefContactAddress.getXRefContactAddressModel());

		if (xrefResult.getSuccess) {
			logDebug("Successfully removed reference contact address to cap contact: " + cSeqNumber);
			return true;
		} else {
			logDebug("Failed to remove reference contact address to cap: " + xrefResult.getErrorMessage());
			return false;
		}

	} else {
		logDebug("Could not remove reference contact address no address model, capId or cap contact sequence number");
		return false;		
	}

}