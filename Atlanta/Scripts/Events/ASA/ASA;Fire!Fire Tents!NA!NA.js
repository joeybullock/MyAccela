true ^ comment("I'm in the ASA fire tent");
cap.isCreatedByACA() ^ email("dmrowland@atlantaga.gov;dlcummings@atlantaga.gov;klhall@atlantaga.gov","auto_sender@accela.com","New Inspection Request","Inspection Request " + capIDString + " has been submitted.  Please follow-up on this request in Accela Automation at avsupp3.accela.com.");
^ updateTask("Application Intake","Accepted","Task updated by Script","Task updated by Script");
^ deactivateTask("Application Intake");
^ activateTask("Captain Assignment Review");
cap.isCreatedByACA() ^ branch("CMN:Building/*/*/*:Calc ACA Convenience Fee"); branch ("CMN:Building/*/*/*:Calc Technology Fee");
!cap.isCreatedByACA() ^ updateTask("Captain Assignment Review","Assigned","Task Updated by Script","Task Updated by Script"); //Not created in ACA
^ deactivateTask("Captain Assignment Review");
^ activateTask("Fire Inspector Review","Task updated by script","Task upated by script");
true ^ email("dmrowland@atlantaga.gov","auto_sender@accela.com","New Tent Request","Tent Request " + capIDString + " has been submitted.  Please follow-up on this request in Accela Automation at avsupp3.accela.com.");