true ^ rfArray = getRelatedCapsByAddressBefore("Enforcement/Complaint/Code Enforcement/*");
rfArray != null ^ for (eachrow in rfArray) branch("PREVENT_DUPLICATE_COMPLAINT")