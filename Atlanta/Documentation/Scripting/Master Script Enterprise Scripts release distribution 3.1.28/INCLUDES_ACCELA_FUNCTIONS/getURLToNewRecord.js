 function getURLToNewRecord(ACAURL,servProvCode,group,typetype,subtype,category) {

    var smb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.servicemanagement.ServiceManagementBusiness").getOutput();
    var sm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.servicemanagement.ServiceModel").getOutput();
    var ctm = aa.cap.getCapTypeModel().getOutput();
    
    ctm.setGroup(group);
    ctm.setType(typetype); 
    ctm.setSubType(subtype);
    ctm.setCategory(category);
    sm.setCapType(ctm);
    sm.setServPorvCode(servProvCode);
    var svcs = smb.getServices(sm).toArray();
    
    // returning first service found 
    
    for (var i in svcs) {
        return ACAURL + "/AgencyRedirect.aspx?agency=" + servProvCode + "&name=" + escape(svcs[i].getServiceName());
    }
    // or nothing
    
    return false;
}
