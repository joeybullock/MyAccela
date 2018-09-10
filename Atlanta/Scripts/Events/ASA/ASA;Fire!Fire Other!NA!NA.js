true ^ comment("I'm in the ASA fire inspection");
^ updateTask("Application Intake","Accepted","Task updated by Script","Task updated by Script");
^ deactivateTask("Application Intake");
^ activateTask("Captain Assignment Review");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee"); branch ("CMN:Building/*/*/*:Calc Technology Fee");
!cap.isCreatedByACA() ^ updateTask("Captain Assignment Review","Assigned","Task Updated by Script","Task Updated by Script"); //Not created in ACA
^ deactivateTask("Captain Assignment Review");
^ activateTask("Fire Inspector Review","Task updated by script","Task upated by script");