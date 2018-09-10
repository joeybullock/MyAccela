 function getPartialCapID(capid)
{
    if (capid == null || aa.util.instanceOfString(capid))
    {
        return null;
    }
    //1. Get original partial CAPID  from related CAP table.
    var result = aa.cap.getProjectByChildCapID(capid, "EST", null);
    if(result.getSuccess())
    {
        projectScriptModels = result.getOutput();
        if (projectScriptModels == null || projectScriptModels.length == 0)
        {
            aa.print("ERROR: Failed to get partial CAP with CAPID(" + capid + ")");
            return null;
        }
        //2. Get original partial CAP ID from project Model
        projectScriptModel = projectScriptModels[0];
        return projectScriptModel.getProjectID();
    }  
    else 
    {
        aa.print("ERROR: Failed to get partial CAP by child CAP(" + capid + "): " + result.getErrorMessage());
        return null;
    }
}

