function callWebService(wsSubScript, wsScriptParameters)
	{

		aa.env.setValue("wsScriptParameters",wsScriptParameters);
		aa.env.setValue("wsScriptDebug","");
		aa.env.setValue("wsScriptMessage","");
		
		var sSubDebug = "";
		var sSubMessage = "";
		
		logDebug("Executing Web Service wsSubScript: " + wsSubScript);
		aa.runScriptInNewTransaction(wsSubScript);
		sSubDebug = aa.env.getValue("wsScriptDebug");
		sSubMessage = aa.env.getValue("wsScriptMessage");
		if (sSubDebug != "")
		{
			//Logging
			logDebug("Debug from wsSubScript: " + wsSubScript);
			logDebug(sSubDebug);
		}
		if (sSubMessage != "")
		{
			//Logging
			logDebug("Message from wsSubScript: " + wsSubScript);
			logDebug(sSubMessage);
		}
		
	}