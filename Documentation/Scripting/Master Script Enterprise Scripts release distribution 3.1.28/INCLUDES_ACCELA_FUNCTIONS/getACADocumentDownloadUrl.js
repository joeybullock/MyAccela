 function getACADocumentDownloadUrl(acaUrl,documentModel) {
   	
   	//returns the ACA URL for supplied document model

	var acaUrlResult = aa.document.getACADocumentUrl(acaUrl, documentModel);
	if(acaUrlResult.getSuccess())
	{
		acaDocUrl = acaUrlResult.getOutput();
		return acaDocUrl;
	}
	else
	{
		logDebug("Error retrieving ACA Document URL: " + acaUrlResult.getErrorType());
		return false;
	}
}


