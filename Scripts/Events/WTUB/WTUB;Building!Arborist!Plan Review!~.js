wfTask == "Yellow Posting Request" && wfStatus == "Received" && wfDateMMDDYYYY < dateAdd(taskStatusDate("Orange Posting"),9) ^ message = "Cannot receive Yellow Posting Request because Orange Posting is less than 9 calendar days old. " + br + wfDate + br + dateAdd(taskStatusDate("Orange Posting"),9); showMessage = true; cancel = true;