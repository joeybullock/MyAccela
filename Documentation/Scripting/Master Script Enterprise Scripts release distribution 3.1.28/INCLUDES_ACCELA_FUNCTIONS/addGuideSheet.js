function addGuideSheet(itemCapId,inspectionId,guideSheetName) {
	
	var rgsm = null;
	var r = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
	if (r) {
		rgsm = r.getRGuideSheet(aa.getServiceProviderCode(), guideSheetName);
	}
	
	var g = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
	
	if (rgsm) {
		var gsSequence = g.createGGuideSheet(itemCapId,rgsm,inspectionId,"ADMIN");
		return gsSequence;
		}
	}
		
