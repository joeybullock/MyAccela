function licenseProfObject(licnumber, lictype) {
	//Populate the License Model
	this.refLicModel = null; //Reference LP Model
	this.infoTableGroupCodeObj = null;
	this.infoTableSubGroupCodesObj = null;
	this.infoTables = new Array(); //Table Array ex infoTables[name][row][column].getValue()
	this.attribs = new Array(); //Array of LP Attributes ex attribs[name]
	this.valid = false; //true if LP is valid
	this.validTables = false; //true if LP has infoTables
	this.validAttrs = false; //true if LP has attributes

	var result = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), licnumber);
	if (result.getSuccess()) {
		var tmp = result.getOutput();
		if (lictype == null)
			lictype = "";
		if (tmp != null)
			for (lic in tmp)
				if (tmp[lic].getLicenseType().toUpperCase() == lictype.toUpperCase() || lictype == "") {
					this.refLicModel = tmp[lic];
					if (lictype == "") {
						lictype = this.refLicModel.getLicenseType();
					}
					break;
				}
	}

	//Get the People Info Tables
	if (this.refLicModel != null) {
		this.infoTableGroupCodeObj = this.refLicModel.getInfoTableGroupCodeModel();
		if (this.infoTableGroupCodeObj == null) {
			//12ACC-00187
			var infoSvc = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput();
			if (infoSvc.getInfoTableGroupCodeModel() != null) {
				infoSvc.getInfoTableGroupCodeModel().setServProvCode(aa.getServiceProviderCode());
				infoSvc.getInfoTableGroupCodeModel().setCategory(1);
				infoSvc.getInfoTableGroupCodeModel().setReferenceId("");
				infoSvc.getInfoTableGroupCodeModel().setName(lictype.toUpperCase());
				var tmpGrp = aa.licenseProfessional.getRefInfoTableGroupCode(infoSvc).getOutput();
				if (tmpGrp != null) { //If table was found set reference ID and write to DB
					tmpGrp.setReferenceId(this.refLicModel.getLicSeqNbr());
					infoSvc.setInfoTableGroupCodeModel(tmpGrp);
					aa.licenseProfessional.createRefInfoTable(infoSvc);

					//Recapture new data with Table Model
					var tmp = null;
					tmp = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), licnumber).getOutput();
					for (lic in tmp)
						if (tmp[lic].getLicenseType().toUpperCase() == lictype.toUpperCase()) {
							this.refLicModel = tmp[lic];
							break;
						}
					//Get the Table Group Code and continue on
					this.infoTableGroupCodeObj = this.refLicModel.getInfoTableGroupCodeModel();
				}
			}
		}
	}

	if (this.infoTableGroupCodeObj != null) {
		var tmp = this.infoTableGroupCodeObj.getSubgroups();
		if (tmp != null)
			this.infoTableSubGroupCodesObj = tmp.toArray();
	}

	//Set flags that can be used for validation
	this.validTables = (this.infoTableSubGroupCodesObj != null);
	this.valid = (this.refLicModel != null);

	//Get all the Table Values, done this way to keep it clean when a row is added
	//Can also be used to refresh manually
	this.refreshTables = function () {
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				var tableArr = new Array()
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
				if (columnsList != null) {
					columnsList = columnsList.toArray();
					for (column in columnsList) {
						var tmpCol = columnsList[column].getTableValues();
						//aa.print(columnsList[column])
						if (tmpCol != null) {
							tmpCol = tmpCol.toArray();
							tmpCol.sort(function (a, b) {
								return a.getRowNumber() - b.getRowNumber()
							})
							//EMSE Dom gets by column, need to pivot to list by row to make usable
							for (var row = 0; row < tmpCol.length; row++) {
								tmpCol[row].setRowNumber(row); //Fix the row numbers
								if (tableArr[row] == null)
									tableArr[row] = new Array();
								tableArr[row][columnsList[column].getName()] = tmpCol[row];
							}
						}
					}
				}
				this.infoTables[this.infoTableSubGroupCodesObj[tbl].getName()] = tableArr;
			}
		}
	}
	this.refreshTables(); //Invoke the Table Refresh to popualte our table arrays

	//Get max row from table for sequencing
	this.getMaxRowByTable = function (vTableName) {
		var maxRow = -1;
		if (this.validTables) {
			var tbl = this.infoTables[vTableName];
			if (tbl != null) {
				for (row in tbl)
					for (col in tbl[row]) //due to way data is stored must loop through all row/columns
						if (maxRow < parseInt(tbl[row][col].getRowNumber()))
							maxRow = parseInt(tbl[row][col].getRowNumber());
			}
		}
		return maxRow;
	}

	//Add Row to Table
	this.addTableRow = function (vTableName, vValueArray) {
		var retVal = false;
		var newRowArray = new Array();
		if (this.validTables)
			for (tbl in this.infoTableSubGroupCodesObj)
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var maxRow = this.getMaxRowByTable(vTableName) + 1;
					var colsArr = this.infoTableSubGroupCodesObj[tbl].getColumnDefines().toArray();
					var colNum = 0;
					colsArr.sort(function (a, b) {
						return (parseInt(a.getDisplayOrder()) - parseInt(b.getDisplayOrder()))
					});
					for (col in colsArr) {
						//12ACC-00189
						var tmpTv = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput().getInfoTableValueModel();
						tmpTv.setAuditStatus("A");
						tmpTv.setServProvCode(aa.getServiceProviderCode());
						tmpTv.setColumnNumber(colNum++);
						tmpTv.setAuditDate(colsArr[col].getAuditDate()); //need proper date
						if (typeof(currentUserID) != 'undefined') //check to make sure a current userID exists
							tmpTv.setAuditId(currentUserID);
						else
							tmpTv.setAuditId("ADMIN"); //default to admin
						tmpTv.setInfoId(colsArr[col].getId());
						tmpTv.setRowNumber(maxRow); //use static new row variable from object
						for (val in vValueArray)
							if (val.toString().toUpperCase() == colsArr[col].getName().toString().toUpperCase()) {
								tmpTv.setValue(vValueArray[val].toString()); //Get Value from associative array
							}

						colsArr[col].addTableValue(tmpTv);
						retVal = true;
					}
					this.refreshTables(); //refresh associative arrays
				}
		return retVal;
	}

	//Process an ASIT row into People Info
	this.addTableFromASIT = function (vTableName, vASITArray) {
		var retVal = true;
		if (this.validTables)
			for (row in vASITArray) { //for Each Row in the ASIT execute the add
				if (!this.addTableRow(vTableName, vASITArray[row]))
					retVal = false;
			}
		else
			retVal = false;
		return retVal;
	}

	//Remove Row from Table
	this.removeTableRow = function (vTableName, vRowIndex) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							var tmpCol = columnsList[column].getTableValues();
							if (tmpCol != null) {
								tmpCol = tmpCol.toArray();
								//aa.print(tmpCol.length);
								if (vRowIndex <= tmpCol.length) {
									var tmpList = aa.util.newArrayList()
										for (row in tmpCol) {
											if (tmpCol[row].getRowNumber() != vRowIndex) {
												tmpList.add(tmpCol[row]);
												//aa.print(tmpCol[row].getColumnNumber() + " :" + tmpCol[row].getRowNumber());
											} else {
												retVal = true;
											}
										}
										columnsList[column].setTableValues(tmpList);
								} //End Remove
							} //end column Check
						} //end column loop
					} //end column list check
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check

		return retVal;
	}

	this.removeTable = function (vTableName) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							var tmpCol = columnsList[column].getTableValues();
							if (tmpCol != null) {
								var tmpList = aa.util.newArrayList()
									columnsList[column].setTableValues(tmpList);
								retVal = true;
							} //End Remove
						} //end column loop
					} //end column list check
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check

		return retVal;
	}

	//Enable or Disable Table Row by index
	this.setTableEnabledFlag = function (vTableName, vRowIndex, isEnabled) {
		var updated = false
			var tmp = null
			tmp = this.infoTables[vTableName];
		if (tmp != null)
			if (tmp[vRowIndex] != null) {
				for (col in tmp[vRowIndex]) {
					tmp[vRowIndex][col].setAuditStatus(((isEnabled) ? "A" : "I"));
					updated = true;
				}
			}
		return updated;
	}

	//Makes table visible in ACA Lookup
	//vIsVisible = 'Y' or 'N'
	this.setDisplayInACA4Table = function (vTableName, vIsVisible) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							columnsList[column].setDisplayLicVeriForACA(vIsVisible);
							retVal = true;
						} //end column loop
					} //end column list check
					if (retVal) {
						var tmpList = aa.util.newArrayList();
						for (col in columnsList) {
							tmpList.add(columnsList[col]);
						}
						this.infoTableSubGroupCodesObj[tbl].setColumnDefines(tmpList);
					}
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check
		return retVal;
	}

	//Get the Attributes for LP
	if (this.valid) {
		var tmpAttrs = this.refLicModel.getAttributes();
		if (tmpAttrs != null) {
			var tmpAttrsList = tmpAttrs.values()
				var tmpIterator = tmpAttrsList.iterator();
			if (tmpIterator.hasNext()) {
				var tmpAttribs = tmpIterator.next().toArray();
				for (x in tmpAttribs) {
					this.attribs[tmpAttribs[x].getAttributeLabel().toUpperCase()] = tmpAttribs[x];
				}
				this.validAttrs = true;
			}
		}
	}

	//get method for Attributes
	this.getAttribute = function (vAttributeName) {
		var retVal = null;
		if (this.validAttrs) {
			var tmpVal = this.attribs[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null)
				retVal = tmpVal.getAttributeValue();
		}
		return retVal;
	}

	//Set method for Attributes
	this.setAttribute = function (vAttributeName, vAttributeValue) {
		var retVal = false;
		if (this.validAttrs) {
			var tmpVal = this.attribs[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null) {
				tmpVal.setAttributeValue(vAttributeValue);
				retVal = true;
			}
		}
		return retVal;
	}

	//Update From Record Contact by Contact Type
	//Uses first contact of type found
	//If contactType == "" then uses primary
	this.updateFromRecordContactByType = function (vCapId, vContactType, vUpdateAddress, vUpdatePhoneEmail) {
		this.retVal = false;
		if (this.valid) {
			var conArr = new Array();
			var capContResult = aa.people.getCapContactByCapID(vCapId);

			if (capContResult.getSuccess()) {
				conArr = capContResult.getOutput();
			} else {
				retVal = false;
			}

			for (contact in conArr) {
				if (vContactType.toString().toUpperCase() ==
					conArr[contact].getPeople().getContactType().toString().toUpperCase()
					 || (vContactType.toString() == "" && conArr[contact].getPeople().getFlag() == "Y")) {

					cont = conArr[contact];
					peop = cont.getPeople();
					addr = peop.getCompactAddress();

					this.refLicModel.setContactFirstName(cont.getFirstName());
					this.refLicModel.setContactMiddleName(peop.getMiddleName()); //get mid from peop
					this.refLicModel.setContactLastName(cont.getLastName());
					this.refLicModel.setBusinessName(peop.getBusinessName());
					if (vUpdateAddress) {
						this.refLicModel.setAddress1(addr.getAddressLine1());
						this.refLicModel.setAddress2(addr.getAddressLine2());
						this.refLicModel.setAddress3(addr.getAddressLine3());
						this.refLicModel.setCity(addr.getCity());
						this.refLicModel.setState(addr.getState());
						this.refLicModel.setZip(addr.getZip());
					}
					if (vUpdatePhoneEmail) {
						this.refLicModel.setPhone1(peop.getPhone1());
						this.refLicModel.setPhone2(peop.getPhone2());
						this.refLicModel.setPhone3(peop.getPhone3());
						this.refLicModel.setEMailAddress(peop.getEmail());
						this.refLicModel.setFax(peop.getFax());
					}
					//Audit Fields
					this.refLicModel.setAgencyCode(aa.getServiceProviderCode());
					this.refLicModel.setAuditDate(sysDate);
					this.refLicModel.setAuditID(currentUserID);
					this.refLicModel.setAuditStatus("A");

					retVal = true;
					break;
				}
			}
		}
		return retVal;
	}

	this.updateFromAddress = function (vCapId) {
		this.retVal = false;
		if (this.valid) {
			var capAddressResult = aa.address.getAddressByCapId(vCapId);
			var addr = null;
			if (capAddressResult.getSuccess()) {
				Address = capAddressResult.getOutput();
				for (yy in Address) {
					if ("Y" == Address[yy].getPrimaryFlag()) {
						addr = Address[yy];
						logDebug("Target CAP has primary address");
						break;
					}
				}
				if (addr == null) {
					addr = Address[0];
				}
			} else {
				logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
			}

			if (addr != null) {
				var addrLine1 = addr.getAddressLine1();
				if (addrLine1 == null) {
					addrLine1 = addr.getHouseNumberStart();
					addrLine1 += (addr.getStreetDirection() != null ? " " + addr.getStreetDirection() : "");
					addrLine1 += (addr.getStreetName() != null ? " " + addr.getStreetName() : "");
					addrLine1 += (addr.getStreetSuffix() != null ? " " + addr.getStreetSuffix() : "");
					addrLine1 += (addr.getUnitType() != null ? " " + addr.getUnitType() : "");
					addrLine1 += (addr.getUnitStart() != null ? " " + addr.getUnitStart() : "");
				}
				this.refLicModel.setAddress1(addrLine1);
				this.refLicModel.setAddress2(addr.getAddressLine2());
				this.refLicModel.setCity(addr.getCity());
				this.refLicModel.setState(addr.getState());
				this.refLicModel.setZip(addr.getZip());
				retVal = true;
			} else {
				retVal = false;
			}
		}
		return retVal;
	}

	//Update From Record Licensed Prof
	//License Number and Type must match that of the Record License Prof
	this.updateFromRecordLicensedProf = function (vCapId) {
		var retVal = false;
		if (this.valid) {

			var capLicenseResult = aa.licenseProfessional.getLicenseProf(capId);
			var capLicenseArr = new Array();
			if (capLicenseResult.getSuccess()) {
				capLicenseArr = capLicenseResult.getOutput();
			} else {
				retVal = false;
			}

			for (capLic in capLicenseArr) {
				if (capLicenseArr[capLic].getLicenseNbr() + "" == this.refLicModel.getStateLicense() + ""
					 && capLicenseArr[capLic].getLicenseType() + "" == this.refLicModel.getLicenseType() + "") {

					licProfScriptModel = capLicenseArr[capLic];

					this.refLicModel.setAddress1(licProfScriptModel.getAddress1());
					this.refLicModel.setAddress2(licProfScriptModel.getAddress2());
					this.refLicModel.setAddress3(licProfScriptModel.getAddress3());
					this.refLicModel.setAgencyCode(licProfScriptModel.getAgencyCode());
					this.refLicModel.setAuditDate(licProfScriptModel.getAuditDate());
					this.refLicModel.setAuditID(licProfScriptModel.getAuditID());
					this.refLicModel.setAuditStatus(licProfScriptModel.getAuditStatus());
					this.refLicModel.setBusinessLicense(licProfScriptModel.getBusinessLicense());
					this.refLicModel.setBusinessName(licProfScriptModel.getBusinessName());
					this.refLicModel.setCity(licProfScriptModel.getCity());
					this.refLicModel.setCityCode(licProfScriptModel.getCityCode());
					this.refLicModel.setContactFirstName(licProfScriptModel.getContactFirstName());
					this.refLicModel.setContactLastName(licProfScriptModel.getContactLastName());
					this.refLicModel.setContactMiddleName(licProfScriptModel.getContactMiddleName());
					this.refLicModel.setContryCode(licProfScriptModel.getCountryCode());
					this.refLicModel.setCountry(licProfScriptModel.getCountry());
					this.refLicModel.setEinSs(licProfScriptModel.getEinSs());
					this.refLicModel.setEMailAddress(licProfScriptModel.getEmail());
					this.refLicModel.setFax(licProfScriptModel.getFax());
					this.refLicModel.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
					this.refLicModel.setPhone1(licProfScriptModel.getPhone1());
					this.refLicModel.setPhone2(licProfScriptModel.getPhone2());
					this.refLicModel.setSelfIns(licProfScriptModel.getSelfIns());
					this.refLicModel.setState(licProfScriptModel.getState());
					this.refLicModel.setLicState(licProfScriptModel.getState());
					this.refLicModel.setSuffixName(licProfScriptModel.getSuffixName());
					this.refLicModel.setWcExempt(licProfScriptModel.getWorkCompExempt());
					this.refLicModel.setZip(licProfScriptModel.getZip());

					//new
					this.refLicModel.setFein(licProfScriptModel.getFein());
					//licProfScriptModel.getBirthDate()
					//licProfScriptModel.getTitle()
					this.refLicModel.setPhone3(licProfScriptModel.getPhone3());
					this.refLicModel.setBusinessName2(licProfScriptModel.getBusName2());

					retVal = true;
				}
			}
		}
		return retVal;
	}

	//Copy Reference Licensed Professional to a Record
	//If replace is true will remove and readd lic_prof
	//Currently wont copy infoTables...
	this.copyToRecord = function (vCapId, vReplace) {
		var retVal = false;
		if (this.valid) {
			var capLicenseResult = aa.licenseProfessional.getLicenseProf(vCapId);
			var capLicenseArr = new Array();
			var existing = false;
			if (capLicenseResult.getSuccess()) {
				capLicenseArr = capLicenseResult.getOutput();
			}

			if (capLicenseArr != null) {
				for (capLic in capLicenseArr) {
					if (capLicenseArr[capLic].getLicenseNbr() + "" == this.refLicModel.getStateLicense() + ""
						 && capLicenseArr[capLic].getLicenseType() + "" == this.refLicModel.getLicenseType() + "") {
						if (vReplace) {
							aa.licenseProfessional.removeLicensedProfessional(capLicenseArr[capLic]);
							break;
						} else {
							existing = true;
						}
					}
				}
			}

			if (!existing) {
				capListResult = aa.licenseScript.associateLpWithCap(vCapId, this.refLicModel);
				retVal = capListResult.getSuccess();
				//Add peopleInfoTables via Workaround (12ACC-00186)
				if (this.validTables && retVal) {
					var tmpLicProfObj = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput();
					this.infoTableGroupCodeObj.setCapId1(vCapId.getID1());
					this.infoTableGroupCodeObj.setCapId2(vCapId.getID2());
					this.infoTableGroupCodeObj.setCapId3(vCapId.getID3());
					//save ref values
					var tmpRefId = this.infoTableGroupCodeObj.getReferenceId();
					var tmpRefType = this.infoTableGroupCodeObj.getReferenceType();
					var tmpRefDesc = this.infoTableGroupCodeObj.getReferenceDesc();
					//update Ref Values
					this.infoTableGroupCodeObj.setReferenceId(this.refLicModel.getStateLicense());
					this.infoTableGroupCodeObj.setReferenceType(this.refLicModel.getLicenseType());
					this.infoTableGroupCodeObj.setReferenceDesc("Description");
					this.infoTableGroupCodeObj.setCategory(1);
					tmpLicProfObj.setInfoTableGroupCodeModel(this.infoTableGroupCodeObj);
					aa.licenseProfessional.createInfoTable(tmpLicProfObj);
					//Set the cap back to null
					this.infoTableGroupCodeObj.setCapId1(null);
					this.infoTableGroupCodeObj.setCapId2(null);
					this.infoTableGroupCodeObj.setCapId3(null);
					//Set the ref values back
					this.infoTableGroupCodeObj.setReferenceId(tmpRefId);
					this.infoTableGroupCodeObj.setReferenceType(tmpRefType);
					this.infoTableGroupCodeObj.setReferenceDesc(tmpRefDesc);
				}
			}
		}
		return retVal;
	}

	this.enable = function () {
		this.refLicModel.setAuditStatus("A");
	}
	this.disable = function () {
		this.refLicModel.setAuditStatus("I");
	}

	//get records associated to license
	this.getAssociatedRecords = function () {
		var retVal = new Array();
		if (this.valid) {
			var resObj = aa.licenseScript.getCapIDsByLicenseModel(this.refLicModel);
			if (resObj.getSuccess()) {
				var tmp = resObj.getOutput();
				if (tmp != null) //make sure your not setting to null otherwise will not work like array
					retVal = tmp;
			}
		}
		return retVal;
	}

	//Save Changes to this object to Ref Licensed Professional
	this.updateRecord = function () {
		var retVal = false
			if (this.valid) {
				this.refreshTables(); //Must ensure row#s are good or wont show in ACA
				var res = aa.licenseScript.editRefLicenseProf(this.refLicModel);
				retVal = res.getSuccess();
			}
			return retVal;
	}

	return this
}