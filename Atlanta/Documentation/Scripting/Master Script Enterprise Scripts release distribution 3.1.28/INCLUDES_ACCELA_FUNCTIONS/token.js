
function token(tstr)
	{
	if (!disableTokens)
		{
		re = new RegExp("\\{","g") ; tstr = String(tstr).replace(re,"AInfo[\"");
		re = new RegExp("\\}","g") ; tstr = String(tstr).replace(re,"\"]");
		}
	return String(tstr);
  	}

