function elapsed() {
  var thisDate = new Date();
  var thisTime = thisDate.getTime();
  return ((thisTime - startTime) / 1000)
}

function logDebug(dstr) {
  if (showDebug) {
      aa.print(dstr)
      emailText += dstr + "<br>";
      aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
      aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(), "", dstr, batchJobID);
  }
}

function getParam(pParamName) //gets parameter value and logs message showing param value
{
  var ret = "" + aa.env.getValue(pParamName);
  logDebug("Parameter : " + pParamName + " = " + ret);
  return ret;
}

function isNull(pTestValue, pNewValue) {
  if (pTestValue == null || pTestValue == "")
      return pNewValue;
  else
      return pTestValue;
}