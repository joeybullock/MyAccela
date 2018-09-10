function getCAPConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;

	////////////////////////////////////////
	// Check Records
	////////////////////////////////////////

	if (pType == null)
		var condResult = aa.capCondition.getCapConditions(itemCap);
	else
		var condResult = aa.capCondition.getCapConditions(itemCap, pType);

	if (condResult.getSuccess())
		var capConds = condResult.getOutput();
	else {
		var capConds = new Array();
		logDebug("**WARNING: getting cap conditions: " + condResult.getErrorMessage());
	}

	var cStatus;
	var cDesc;
	var cImpact;

	for (cc in capConds) {
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus();
		var cDesc = thisCond.getConditionDescription();
		var cImpact = thisCond.getImpactCode();
		var cType = thisCond.getConditionType();
		var cComment = thisCond.getConditionComment();
		var cExpireDate = thisCond.getExpireDate();

		if (cStatus == null)
			cStatus = " ";
		if (cDesc == null)
			cDesc = " ";
		if (cImpact == null)
			cImpact = " ";
		//Look for matching condition

		if ((pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
			var r = new condMatchObj;
			r.objType = "Record";
			r.object = thisCond;
			r.status = cStatus;
			r.type = cType;
			r.impact = cImpact;
			r.description = cDesc;
			r.comment = cComment;
			r.expireDate = cExpireDate;

			var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

			r.arObject = langCond;
			r.arDescription = langCond.getResConditionDescription();
			r.arComment = langCond.getResConditionComment();

			resultArray.push(r);
		}
	}

	return resultArray;
}
function getAddressConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Address
	////////////////////////////////////////

	var addrResult = aa.address.getAddressByCapId(itemCap);
	if (!addrResult.getSuccess()) {
		logDebug("**WARNING: getting CAP addresses: " + addrResult.getErrorMessage());
		var addrArray = new Array();
	} else {
		var addrArray = addrResult.getOutput();
		if (!addrArray)
			addrArray = new Array();
	}

	for (var thisAddr in addrArray)
		if (addrArray[thisAddr].getRefAddressId()) {
			addCondResult = aa.addressCondition.getAddressConditions(addrArray[thisAddr].getRefAddressId())
				if (!addCondResult.getSuccess()) {
					logDebug("**WARNING: getting Address Conditions : " + addCondResult.getErrorMessage());
					var addrCondArray = new Array();
				} else {
					var addrCondArray = addCondResult.getOutput();
				}

				for (var thisAddrCond in addrCondArray) {
					var thisCond = addrCondArray[thisAddrCond];
					var cType = thisCond.getConditionType();
					var cStatus = thisCond.getConditionStatus();
					var cDesc = thisCond.getConditionDescription();
					var cImpact = thisCond.getImpactCode();
					var cType = thisCond.getConditionType();
					var cComment = thisCond.getConditionComment();
					var cExpireDate = thisCond.getExpireDate();

					if (cType == null)
						cType = " ";
					if (cStatus == null)
						cStatus = " ";
					if (cDesc == null)
						cDesc = " ";
					if (cImpact == null)
						cImpact = " ";

					if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
						var r = new condMatchObj;
						r.objType = "Address";
						r.addressObj = addrArray[thisAddr];
						r.status = cStatus;
						r.type = cType;
						r.impact = cImpact;
						r.description = cDesc;
						r.comment = cComment;
						r.expireDate = cExpireDate;

						var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

						r.arObject = langCond;
						r.arDescription = langCond.getResConditionDescription();
						r.arComment = langCond.getResConditionComment();

						resultArray.push(r);
					}
				}
		}

	return resultArray;
}
function getParcelConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Parcel
	////////////////////////////////////////

	var parcResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
	if (!parcResult.getSuccess()) {
		logDebug("**WARNING: getting CAP addresses: " + parcResult.getErrorMessage());
		var parcArray = new Array();
	} else {
		var parcArray = parcResult.getOutput();
		if (!parcArray)
			parcArray = new Array();
	}

	for (var thisParc in parcArray)
		if (parcArray[thisParc].getParcelNumber()) {
			parcCondResult = aa.parcelCondition.getParcelConditions(parcArray[thisParc].getParcelNumber())
				if (!parcCondResult.getSuccess()) {
					logDebug("**WARNING: getting Parcel Conditions : " + parcCondResult.getErrorMessage());
					var parcCondArray = new Array();
				} else {
					var parcCondArray = parcCondResult.getOutput();
				}

				for (var thisParcCond in parcCondArray) {
					var thisCond = parcCondArray[thisParcCond];
					var cType = thisCond.getConditionType();
					var cStatus = thisCond.getConditionStatus();
					var cDesc = thisCond.getConditionDescription();
					var cImpact = thisCond.getImpactCode();
					var cType = thisCond.getConditionType();
					var cComment = thisCond.getConditionComment();
					var cExpireDate = thisCond.getExpireDate();

					if (cType == null)
						cType = " ";
					if (cStatus == null)
						cStatus = " ";
					if (cDesc == null)
						cDesc = " ";
					if (cImpact == null)
						cImpact = " ";

					if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
						var r = new condMatchObj;
						r.objType = "Parcel";
						r.parcelObj = parcArray[thisParc];
						r.status = cStatus;
						r.type = cType;
						r.impact = cImpact;
						r.description = cDesc;
						r.comment = cComment;
						r.expireDate = cExpireDate;

						var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

						r.arObject = langCond;
						r.arDescription = langCond.getResConditionDescription();
						r.arComment = langCond.getResConditionComment();

						resultArray.push(r);
					}
				}
		}

	return resultArray;
}
function getLicenseConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check License
	////////////////////////////////////////

	var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);

	if (!capLicenseResult.getSuccess()) {
		logDebug("**WARNING: getting CAP licenses: " + capLicenseResult.getErrorMessage());
		var licArray = new Array();
	} else {
		var licArray = capLicenseResult.getOutput();
		if (!licArray)
			licArray = new Array();
	}

	for (var thisLic in licArray)
		if (licArray[thisLic].getLicenseProfessionalModel().getLicSeqNbr()) {
			var licCondResult = aa.caeCondition.getCAEConditions(licArray[thisLic].getLicenseProfessionalModel().getLicSeqNbr());
			if (!licCondResult.getSuccess()) {
				logDebug("**WARNING: getting license Conditions : " + licCondResult.getErrorMessage());
				var licCondArray = new Array();
			} else {
				var licCondArray = licCondResult.getOutput();
			}

			for (var thisLicCond in licCondArray) {
				var thisCond = licCondArray[thisLicCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus == null)
					cStatus = " ";
				if (cDesc == null)
					cDesc = " ";
				if (cImpact == null)
					cImpact = " ";

				if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
					var r = new condMatchObj;
					r.objType = "License";
					r.licenseObj = licArray[thisLic];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();

					resultArray.push(r);
				}
			}
		}

	return resultArray;
}

function getContactConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Contacts
	////////////////////////////////////////


	var capContactResult = aa.people.getCapContactByCapID(itemCap);

	if (!capContactResult.getSuccess()) {
		logDebug("**WARNING: getting CAP contact: " + capContactResult.getErrorMessage());
		var conArray = new Array();
	} else {
		var conArray = capContactResult.getOutput();
		if (!conArray)
			conArray = new Array();
	}

	for (var thisCon in conArray)
		if (conArray[thisCon].getCapContactModel().getRefContactNumber()) {
			var conCondResult = aa.commonCondition.getCommonConditions("CONTACT", conArray[thisCon].getCapContactModel().getRefContactNumber());

			if (!conCondResult.getSuccess()) {
				logDebug("**WARNING: getting contact Conditions : " + licCondResult.getErrorMessage());
				var conCondArray = new Array();
			} else {
				var conCondArray = conCondResult.getOutput();
			}

			for (var thisConCond in conCondArray) {
				var thisCond = conCondArray[thisConCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus == null)
					cStatus = " ";
				if (cDesc == null)
					cDesc = " ";
				if (cImpact == null)
					cImpact = " ";

				if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
					var r = new condMatchObj;
					r.objType = "Contact";
					r.contactObj = conArray[thisCon];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();

					resultArray.push(r);
				}
			}
		}

	return resultArray;
}

function getConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var conditions = getCAPConditions(pType, pStatus, pDesc, pImpact);
	var addressConditions = getAddressConditions(pType, pStatus, pDesc, pImpact);
	if (addressConditions) {
		for (var i = 0; i < addressConditions.length; i++) {
			conditions.push(addressConditions[i]);
		}
	}

	var parcelConditions = getParcelConditions(pType, pStatus, pDesc, pImpact);
	if (parcelConditions) {
		for (var i = 0; i < parcelConditions.length; i++) {
			conditions.push(parcelConditions[i]);
		}
	}

	var licenseConditions = getLicenseConditions(pType, pStatus, pDesc, pImpact);
	if (licenseConditions) {
		for (var i = 0; i < licenseConditions.length; i++) {
			conditions.push(licenseConditions[i]);
		}
	}

	var contactConditons = getContactConditions(pType, pStatus, pDesc, pImpact);
	if (contactConditons) {
		for (var i = 0; i < contactConditons.length; i++) {
			conditions.push(contactConditons[i]);
		}
	}

	return conditions;
}

function condMatchObj() {
	this.objType = null;
	this.object = null;
	this.contactObj = null;
	this.addressObj = null;
	this.licenseObj = null;
	this.parcelObj = null;
	this.status = null;
	this.type = null;
	this.impact = null;
	this.description = null;
	this.comment = null;
	this.arObject = null;
	this.arDescription = null;
	this.arComment = null;
	this.expireDate = null;
}