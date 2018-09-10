function lpSet(desiredSetId) {
	this.refresh = function () {

		var theSet = aa.set.getSetByPK(this.id).getOutput();
		this.status = theSet.getSetStatus();
		this.setId = theSet.getSetID();
		this.name = theSet.getSetTitle();
		this.comment = theSet.getSetComment();
		this.model = theSet.getSetHeaderModel();
		this.statusComment = theSet.getSetStatusComment();

		var memberResult = aa.set.getLPSetMembersByPK(this.id);

		if (!memberResult.getSuccess()) {
			logDebug("**WARNING** error retrieving set members " + memberResult.getErrorMessage());
		} else {
			this.members = memberResult.getOutput().toArray();
			this.size = this.members.length;
			if (this.members.length > 0) {
				this.empty = false;
				}
			logDebug("lpSet: loaded set " + this.id + " of status " + this.status + " with " + this.size + " records");
		}
	}

	this.add = function (addLicNum) {
		var setMemberStatus;
		if (arguments.length == 2)
			setMemberStatus = arguments[1];

		try {
			var addLic = getRefLicenseProf(addLicNum);
			var addResult = aa.set.addLPSetMember(this.id, addLic.licSeqNbr);

			if (!addResult.getSuccess()) {
				logDebug("**WARNING** error removing license from set " + this.id + " : " + addResult.getErrorMessage());
			} else {
				logDebug("lpSet: added LP " + addLicNum + " from set " + this.id);
			}
		} catch (err) {
			logDebug("**ERROR** error adding license from set " + this.id + " : " + err.message);
		}

	}

	this.remove = function (removeLicNum) {
		try {
			var removeLic = getRefLicenseProf(removeLicNum);
			var removeResult = aa.set.removeSetHeadersListByLP(this.id, removeLic.licSeqNbr)
				if (!removeResult.getSuccess()) {
					logDebug("**WARNING** error removing license from set " + this.id + " : " + removeResult.getErrorMessage());
				} else {
					logDebug("lpSet: removed license " + removeLicNum + " from set " + this.id);
				}
		} catch (err) {
			logDebug("**ERROR** error removing license from set " + this.id + " : " + err.message);
		}
	}

	this.update = function () {
		var sh = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.SetBusiness").getOutput();
		this.model.setSetStatus(this.status)
		this.model.setSetID(this.setId);
		this.model.setSetTitle(this.name);
		this.model.setSetComment(this.comment);
		this.model.setSetStatusComment(this.statusComment);
		this.model.setRecordSetType(this.type);

		logDebug("lpSet: updating set header information");
		try {
			updateResult = sh.updateSetBySetID(this.model);
		} catch (err) {
			logDebug("**WARNING** error updating set header failed " + err.message);
		}

	}

	this.id = desiredSetId;
	this.name = desiredSetId;
	this.type = null;
	this.comment = null;

	if (arguments.length > 1 && arguments[1])
		this.name = arguments[1];
	if (arguments.length > 2 && arguments[2])
		this.type = arguments[2];
	if (arguments.length > 3 && arguments[3])
		this.comment = arguments[3];

	this.size = 0;
	this.empty = true;
	this.members = new Array();
	this.status = "";
	this.statusComment = "";
	this.model = null;

	var theSetResult = aa.set.getSetByPK(this.id);

	if (theSetResult.getSuccess()) {
		this.refresh();
	} else // add the set
	{
		theSetResult = aa.set.createSet(this.id, this.name, "LICENSE_PROFESSIONAL", this.comment); // Options: CAP (Default), LICENSE_PROFESSIONAL, PARCEL, ADDRESS, RANDOMAUDIT
		if (!theSetResult.getSuccess()) {
			logDebug("**WARNING** error creating set " + this.id + " : " + theSetResult.getErrorMessage);
		} else {
			logDebug("lpSet: Created new set " + this.id + " of type " + this.type);
			this.refresh();
		}
	}

}
