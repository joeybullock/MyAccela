function getNode(fString,fName)
	{
	 var fValue = "";
	 var startTag = "<"+fName+">";
	 var endTag = "</"+fName+">";

	 startPos = fString.indexOf(startTag) + startTag.length;
	 endPos = fString.indexOf(endTag);
	 // make sure startPos and endPos are valid before using them
	 if (startPos > 0 && startPos < endPos)
		  fValue = fString.substring(startPos,endPos);

	 return unescape(fValue);
	}
	
