wfTask == "Consultation" && wfStatus == "Cancelled" ^ updateTask("Consultation","Cancelled","Cancelled"); updateTask("Closure","Closed"); closeTask("Consultation"); closeTask("Closure");
wfTask == "Consultation" && wfStatus == "Completed" ^ updateTask("Consultation","Completed","Completed"); closeTask("Consultation"); closeTask("Closure");