appMatch("Building/*/*/*") && proximity("Atlanta_AA","Elementary Schools",1100) ^ showMessage=true; message="<p><font color=red>Warning!</font> This property may be within 1,000 feet of a school.</p>"; cancel = false
appMatch("Building/*/*/*") && proximityToAttribute("Atlanta_AA","Neighborhoods",-1,"feet","NAME","Poncey-Highland") ^ showMessage = true; comment("<p><font color=red>ATTENTION!</font> This property is within the Poncey-Highland Neighborhood</p>");
appMatch("Building/*/*/*") && proximity("Atlanta_AA","100-Year Floodplain",10) ^ showMessage=true; message="<p><font color=red>Warning!</font> This property may be within the 100 Year Flood Plain.</p>"; cancel = false
appMatch("Building/*/*/*") && proximity("Atlanta_AA","Proximity",-2) ^ showMessage=true; message="<p><font color=red>Warning!</font> This property may be within the South Moreland moratorium area.</p>"; cancel = false