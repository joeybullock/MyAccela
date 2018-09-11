true ^ editAppSpecific("CDP Land Use", getGISInfo("Atlanta_AA","Future Land Use","LANDUSE",-10));
true ^ npuArray = new Array(); npuArray = getGISBufferInfo("Atlanta_AA","NPU Associated 1","-10","NPU","ZONING","ZONING_PHONE","ZONING_EMAIL");
npuArray.length > 0 ^ editAppSpecific("NPU Associated 1", npuArray[0]["NPU"]); editAppSpecific("NPU1 Contact", npuArray[0]["ZONING"]); editAppSpecific("NPU1 phone", npuArray[0]["ZONING_PHONE"]); editAppSpecific("NPU1 email", npuArray[0]["ZONING_EMAIL"]);
npuArray.length > 1 ^ editAppSpecific("NPU Associated 2", npuArray[1]["NPU"]); editAppSpecific("NPU2 contact", npuArray[1]["ZONING"]); editAppSpecific("NPU2 phone", npuArray[1]["ZONING_PHONE"]); editAppSpecific("NPU2 email", npuArray[1]["ZONING_EMAIL"]);
npuArray.length > 2 ^ editAppSpecific("NPU Associated 3", npuArray[2]["NPU"]); editAppSpecific("NPU3 contact", npuArray[2]["ZONING"]); editAppSpecific("NPU3 phone", npuArray[2]["ZONING_PHONE"]); editAppSpecific("NPU3 email", npuArray[2]["ZONING_EMAIL"]);
true  ^ var pCapDetailObj = aa.cap.getCapDetail(capId); parentId  = capId;  if (pCapDetailObj.getSuccess()) pCapDetail = pCapDetailObj.getOutput();
true ^ editAppSpecific("Case Assigned To", pCapDetail.getAsgnStaff()); logDebug("Assigned To " + pCapDetail.getAsgnStaff());
IZArray.length > 0 ^ addParcelCondition(null,"Inclusionary Zoning","Applied","Inclusionary Zoning Area","This is within the Inclusionary Zoning Area.  If the development is for a multi-family with 10 or more rental units, then they must comply with Affordable Housing's Inclusionary Zoning ordinance.","Notice");