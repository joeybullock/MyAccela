function getDepartmentName(username)
	{
	var suo = aa.person.getUser(username).getOutput(); 
	var dpt = aa.people.getDepartmentList(null).getOutput();
	for (var thisdpt in dpt)
	  	{
	  	var m = dpt[thisdpt]
	  	var  n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode() 
	  
	  	if (n.equals(suo.deptOfUser)) 
	  	return(m.getDeptName())
  		}
  	}
  
  