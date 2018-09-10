function runEvent(eventName, controlString) {
	try {
		var savePrefix = prefix; // store value of global variable

		if (controlString) {
			if (doStdChoices) {
				doStandardChoiceActions(controlString, true, 0);
			} else {
				logDebug("runEvent:  Can't execute standard choices for control string " + controlString + " because doStdChoices is false");
			}
		}

		prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", eventName);
		if (prefix) {
			if (doScripts) {
				doScriptActions();
			} else {
				logDebug("runEvent:  Can't execute scripts for event " + eventName + " because doScripts is false");
			}
		} else {
			logDebug("runEvent:  Can't execute scripts for event " + eventName + " because prefix is not defined in std Choice EMSE_VARIABLE_BRANCH_PREFIX");
		}

		prefix = savePrefix; // set it back

	} catch (err) {
		handleError(err, s);
	}
}
