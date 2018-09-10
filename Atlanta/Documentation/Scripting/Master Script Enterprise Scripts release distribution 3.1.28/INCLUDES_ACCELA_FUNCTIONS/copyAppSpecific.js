function copyAppSpecific(newCap) // copy all App Specific info into new Cap, 1 optional parameter for ignoreArr
{
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 1) 
	{
		ignoreArr = arguments[1];
		limitCopy = true;
	}
	
	for (asi in AInfo){
		//Check list
		if(limitCopy){
			var ignore=false;
		  	for(var i = 0; i < ignoreArr.length; i++)
		  		if(ignoreArr[i] == asi){
		  			ignore=true;
		  			break;
		  		}
		  	if(ignore)
		  		continue;
		}
		editAppSpecific(asi,AInfo[asi],newCap);
	}
}

