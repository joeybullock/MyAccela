function updateRefParcelToCap() //Takes Optional CapId
{
	var vCapId = null;
	if (arguments.length > 0)
		vCapId = arguments[0];
	else
		vCapId = capId;

	var capPrclArr = aa.parcel.getParcelDailyByCapID(vCapId, null).getOutput();
	if (capPrclArr != null) {
		for (x in capPrclArr) {
			var prclObj = aa.parcel.getParceListForAdmin(capPrclArr[x].getParcelNumber(), null, null, null, null, null, null, null, null, null);
			if (prclObj.getSuccess()) {
				var prclArr = prclObj.getOutput();
				if (prclArr.length) {
					var prcl = prclArr[0].getParcelModel();
					var refParcelNumber = prcl.getParcelNumber();
					var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(vCapId, prcl);

					if (capPrclObj.getSuccess()) {

						var capPrcl = capPrclObj.getOutput();
						capPrcl.setL1ParcelNo(refParcelNumber);
						aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						logDebug("Updated Parcel " + capPrclArr[x].getParcelNumber() + " with Reference Data");
					} else
						logDebug("Failed to Wrap Parcel Model for " + capPrclArr[x].getParcelNumber());

				} else
					logDebug("No matching reference Parcels found for " + capPrclArr[x].getParcelNumber());
			} else
				logDebug("Failed to get reference Parcel for " + capPrclArr[x].getParcelNumber())
		}
	}
}