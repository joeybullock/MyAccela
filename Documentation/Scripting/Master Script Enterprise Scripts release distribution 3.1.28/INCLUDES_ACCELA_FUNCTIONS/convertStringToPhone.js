function convertStringToPhone(theString) {
	var n = "22233344455566677778889999";

	var compString = String(theString.toUpperCase());
	var retString = "";

	for (var x = 0; x < compString.length; x++) {
		if (compString[x] >= "A" && compString[x] <= "Z") {
			retString += n[compString.charCodeAt(x) - 65]
		} else {
			retString += compString[x];
		}
	}
	return retString;
}
