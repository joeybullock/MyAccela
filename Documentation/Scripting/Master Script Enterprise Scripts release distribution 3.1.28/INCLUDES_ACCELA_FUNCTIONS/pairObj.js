function pairObj(actID) {
	this.ID = actID;
	this.cri = null;
	this.act = null;
	this.elseact = null;
	this.enabled = true;
	this.continuation = false;
	this.branch = new Array();

	this.load = function (loadStr) {
		//
		// load() : tokenizes and loades the criteria and action
		//
		loadArr = loadStr.split("\\^");
		if (loadArr.length < 2 || loadArr.length > 3) {
			logMessage("**ERROR: The following Criteria/Action pair is incorrectly formatted.  Two or three elements separated by a caret (\"^\") are required. " + br + br + loadStr)
		} else {
			this.cri = loadArr[0];
			this.act = loadArr[1];
			this.elseact = loadArr[2];

			if (this.cri.length() == 0)
				this.continuation = true; // if format is like ("^action...") then it's a continuation of previous line

			var a = loadArr[1];
			var bb = a.indexOf("branch(");
			while (!enableVariableBranching && bb >= 0) {
				var cc = a.substring(bb);
				var dd = cc.indexOf("\")");
				if (dd < 0)
					break;
				if (dd >= 9)
					this.branch.push(cc.substring(8, dd));
				a = cc.substring(dd);
				bb = a.indexOf("branch(");
			}

		}
	}
}