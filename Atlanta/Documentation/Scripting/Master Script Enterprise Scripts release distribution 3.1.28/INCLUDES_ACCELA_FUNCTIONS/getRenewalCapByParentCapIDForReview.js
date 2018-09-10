 function getRenewalCapByParentCapIDForReview(parentCapid)
{
    if (parentCapid == null || aa.util.instanceOfString(parentCapid))
    {
        return null;
    }
    //1. Get parent license for review
    var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Review");
    if(result.getSuccess())
    {
        projectScriptModels = result.getOutput();
        if (projectScriptModels == null || projectScriptModels.length == 0)
        {
            aa.print("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for review");
            return null;
        }
        //2. return parent CAPID.
        projectScriptModel = projectScriptModels[0];
        return projectScriptModel;
    }  
    else 
    {
      aa.print("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for review: " + result.getErrorMessage());
      return null;
    }
}

