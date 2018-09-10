true ^ showMessage = false; showDebug = false; var beforeToday = false; var theInspectionDate = ""; var wfDueDate = getWfDueDate("Y");
true ^ beforeToday = checkIfNewDateIsBeforeToday(dayOfWeekInTheMonth(wfDueDate, 3, 3, -15, "Y"));
beforeToday == true ^ theInspectionDate = dayOfWeekInTheMonth(dateAddMonths(wfDueDate, 1), 3, 3, -15, "N");
beforeToday == false ^ theInspectionDate = dayOfWeekInTheMonth(wfDueDate, 3, 3, -15, "N");
true ^ scheduleInspectDate("502 White Posting",theInspectionDate,Arborist,null,"Scheduled via script");