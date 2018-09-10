inspType == "Follow Up Action" && inspResult== "Transfer to Court" ^ deactivateTask("Initial Inspection");activateTask("NPU Supervisor Review"); editTaskDueDate("NPU Supervisor Review",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult == "Refer to DPW" ^ updateTask("Re-Inspection","Refer to DPW"); deactivateTask("Re-Inspection"); activateTask("Supervisor Review");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ updateTask("Initial Inspection","Return to Supervisor"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "No Violation Found" ^ updateTask("Initial Inspection","No Violation Found"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","No Violation Found");
inspType == "Initial Inspection" && inspResult== "Transfer to Another Agency" ^ updateTask("Initial Inspection","Transfer to Another Agency"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Transferred to Another Agency");
inspType == "Initial Inspection" && inspResult== "Notice to Clerical" ^ updateTask("Initial Inspection","Notice to Clerical"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "Notice Hand Delivered" && typeof(NOTICEDATES) =="object" ^ scheduleInspectDate("Reinspection", nextWorkDay(dateAdd(NOTICEDATES[(NOTICEDATES.length-1)]["Notice Finish Date"],+0)),getLastInspector("Initial Inspection"), null, "My Comment");updateTask("Initial Inspection","Notice Hand Delivered"); deactivateTask("Initial Inspection"); activateTask("Re-Inspection");
inspType == "Initial Inspection" && inspResult== "Citation-Schedule Service" ^ updateTask("Initial Inspection","Citation-Schedule Service"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "Citation to Clerical" ^ updateTask("Initial Inspection","Citation to Clerical"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "Citation Served" && typeof(CITATIONS) =="object" ^ scheduleInspectDate("Court Reinspection", nextWorkDay(dateAdd(CITATIONS[(CITATIONS.length-1)]["Court Date"],-2)), getLastInspector("Initial Inspection"), null, "My Comment"); updateTask("Initial Inspection","Citation Served"); deactivateTask("Initial Inspection");activateTask("Court");activateTask("PreCourt ReInspection","BOCC COURT");activateTask("Court Appearance","BOCC COURT"); editTaskDueDate("Court Appearance",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "Complied" ^ updateTask("Initial Inspection","Complied"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Complied");
inspType == "Follow Up Action" && inspResult== "Return to Supervisor" ^ updateTask("Initial Inspection","Return to Supervisor"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult== "No Violation Found" ^ updateTask("Initial Inspection","No Violation Found"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","No Violation Found");
inspType == "Follow Up Action" && inspResult== "Transfer to Another Agency" ^ updateTask("Initial Inspection","Transfer to Another Agency"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Transferred to Another Agency");
inspType == "Follow Up Action" && inspResult== "Notice to Clerical" ^ updateTask("Initial Inspection","Notice to Clerical"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Generate Notice - Citation Letter",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult== "Notice Hand Delivered" && typeof(NOTICEDATES) =="object" ^ scheduleInspectDate("Reinspection", nextWorkDay(dateAdd(NOTICEDATES[(NOTICEDATES.length-1)]["Notice Finish Date"],+0)),getLastInspector("Follow Up Action"), null, "My Comment"); updateTask("Initial Inspection","Notice Hand Delivered"); deactivateTask("Initial Inspection"); activateTask("Re-Inspection");
inspType == "Follow Up Action" && inspResult== "Citation-Schedule Service" ^ updateTask("Initial Inspection","Citation-Schedule Service"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));+
inspType == "Follow Up Action" && inspResult== "Citation to Clerical" ^ updateTask("Initial Inspection","Citation to Clerical"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult== "Citation Served" && typeof(CITATIONS) =="object" ^ scheduleInspectDate("Court Reinspection", nextWorkDay(dateAdd(CITATIONS[(CITATIONS.length-1)]["Court Date"],-2)), getLastInspector("Follow Up Action"), null, "My Comment"); updateTask("Initial Inspection","Citation Served"); deactivateTask("Initial Inspection");activateTask("Court");activateTask("PreCourt ReInspection","BOCC COURT");activateTask("Court Appearance","BOCC COURT"); editTaskDueDate("Court Appearance",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult== "Refer to Staff Research" ^ updateTask("Initial Inspection","Refer to Staff Research"); deactivateTask("Initial Inspection");activateTask("Staff Research"); editTaskDueDate("Staff Research",dateAdd(null,1));
inspType == "Follow Up Action" && inspResult== "Complied" ^ updateTask("Initial Inspection","Complied"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Complied");
inspType == "Reinspection" && inspResult== "Complied" ^ updateTask("Re-Inspection","Complied"); deactivateTask("Re-Inspection");activateTask("Close"); closeTask("Close","Complied");
inspType == "Reinspection" && inspResult== "Extension Request" ^ updateTask("Re-Inspection","Extension Request"); deactivateTask("Re-Inspection");activateTask("Extension Review"); editTaskDueDate("Extension Review",dateAdd(null,1));
inspType == "Reinspection" && inspResult== "Citation-Schedule Service" ^ updateTask("Re-Inspection","Citation-Schedule Service"); deactivateTask("Re-Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Reinspection" && inspResult== "Citation to Clerical" ^ updateTask("Re-Inspection","Citation to Clerical"); deactivateTask("Re-Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Reinspection" && inspResult== "Citation Served" && typeof(CITATIONS) =="object" ^ scheduleInspectDate("Court Reinspection", nextWorkDay(dateAdd(CITATIONS[(CITATIONS.length-1)]["Court Date"],-2)), getLastInspector("Reinspection"), null, "My Comment"); updateTask("Re-Inspection","Citation Served"); deactivateTask("Re-Inspection");activateTask("Court");activateTask("PreCourt ReInspection","BOCC COURT");activateTask("Court Appearance","BOCC COURT"); editTaskDueDate("Court Appearance",dateAdd(null,1));
inspType == "Reinspection" && inspResult== "Return to Supervisor" ^ updateTask("Re-Inspection","Return to Supervisor"); deactivateTask("Re-Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Complied" ^ updateTask("Re-Inspection","Complied"); deactivateTask("Re-Inspection");activateTask("Close"); closeTask("Close","Complied");
inspType == "ReInsp Follow Up Action" && inspResult== "Extension Request" ^ updateTask("Re-Inspection","Extension Request"); deactivateTask("Re-Inspection");activateTask("Extension Review"); editTaskDueDate("Extension Review",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Refer to Staff Research" ^ updateTask("Re-Inspection","Refer to Staff Research"); deactivateTask("Re-Inspection");activateTask("Staff Research"); editTaskDueDate("Staff Research",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Citation-Schedule Service" ^ updateTask("Re-Inspection","Citation-Schedule Service"); deactivateTask("Re-Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Citation to Clerical" ^ updateTask("Re-Inspection","Citation to Clerical"); deactivateTask("Re-Inspection");activateTask("Generate Notice - Citation Letter"); editTaskDueDate("Generate Notice - Citation Letter",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Citation Served" && typeof(CITATIONS) =="object" ^ scheduleInspectDate("Court Reinspection", nextWorkDay(dateAdd(CITATIONS[(CITATIONS.length-1)]["Court Date"],-2)), getLastInspector("Reinsp Follow Up Action"), null, "My Comment"); updateTask("Re-Inspection","Citation Served"); deactivateTask("Re-Inspection");activateTask("Court");activateTask("PreCourt ReInspection","BOCC COURT");activateTask("Court Appearance","BOCC COURT"); editTaskDueDate("Court Appearance",dateAdd(null,1));
inspType == "ReInsp Follow Up Action" && inspResult== "Return to Supervisor" ^ updateTask("Re-Inspection","Return to Supervisor"); deactivateTask("Re-Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Return to Supervisor" ^ updateTask("Initial Inspection","Return to Supervisor"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Transfer to Another Agency" ^ updateTask("Initial Inspection","Transfer to Another Agency"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Transferred to Another Agency");
inspType == "Citation Service Stop" && inspResult== "Citation-Schedule Service" ^ updateTask("Initial Inspection","Citation-Schedule Service"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Citation to Clerical" ^ updateTask("Initial Inspection","Citation to Clerical"); deactivateTask("Initial Inspection");activateTask("Generate Notice - Citation Letter"); editTaskDueDate("Generate Notice - Citation Letter",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Citation Served" && typeof(CITATIONS) =="object" ^ scheduleInspectDate("Court Reinspection", nextWorkDay(dateAdd(CITATIONS[(CITATIONS.length-1)]["Court Date"],-2)), getLastInspector("Citation Service Stop"), null, "My Comment"); updateTask("Initial Inspection","Citation Served"); deactivateTask("Initial Inspection");activateTask("Court");activateTask("PreCourt ReInspection","BOCC COURT");activateTask("Court Appearance","BOCC COURT"); editTaskDueDate("Court Appearance",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Refer to Staff Research" ^ updateTask("Initial Inspection","Refer to Staff Research"); deactivateTask("Initial Inspection");activateTask("Staff Research"); editTaskDueDate("Staff Research",dateAdd(null,1));
inspType == "Citation Service Stop" && inspResult== "Complied" ^ updateTask("Initial Inspection","Complied"); deactivateTask("Initial Inspection");activateTask("Close"); closeTask("Close","Complied");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");
inspType == "Initial Inspection" && inspResult== "Missed Inspection" ^ updateTask("Initial Inspection","Missed Inspection"); deactivateTask("Initial Inspection");activateTask("Supervisor Review"); editTaskDueDate("Supervisor Review",dateAdd(null,1));
inspType == "Initial Inspection" && inspResult== "Return to Supervisor" ^ if(matches({NPU},"E","J","K","L","M","W")) assignTask("Supervisor Review","DLBRYANT"); if(matches({NPU},"G","H","V","X")) assignTask("Supervisor Review","RHOLT"); if(matches({NPU},"A","B","C","D","F","I","N","O","Q","P","R","S","T","Y","Z")) assignTask("Supervisor Review","SJTUCKER");








