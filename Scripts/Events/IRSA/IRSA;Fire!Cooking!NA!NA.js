^ activateTask("Application Intake");
^ updateTask("Application Intake","Accepted","Task updated by Script","Task updated by Script");
^ deactivateTask("Application Intake");
^ activateTask("Captain Assignment Review");
^ updateTask("Captain Assignment Review","Accepted","Task updated by Script","Task updated by Script");
^ deactivateTask("Captain Assignment Review");
inspType == "Fire Cooking" && inspResult == "Approved within 5 days" ^ updateTask("Fire Inspector Review","Complete","Updated by Inspection Result","Note"); deactivateTask("Fire Inspector Review"); updateTask("Fire Inspection Complete","Complete"); deactivateTask("Fire Inspection Complete"); updateAppStatus("Complete","Updated via script");
inspType == "Fire Cooking" && inspResult == "Approved after 5 days" ^ updateTask("Fire Inspector Review","Complete","Updated by Inspection Result","Note"); deactivateTask("Fire Inspector Review"); updateTask("Fire Inspection Complete","Complete"); deactivateTask("Fire Inspection Complete"); updateAppStatus("Complete","Updated via script");
inspType == "Fire Cooking" && inspResult == "Denied" ^ updateTask("Fire Inspector Review","Complete","Updated by Inspection Result","Note"); deactivateTask("Fire Inspector Review"); updateTask("Fire Inspection Complete","Complete"); deactivateTask("Fire Inspection Complete"); updateAppStatus("Complete","Updated via script");