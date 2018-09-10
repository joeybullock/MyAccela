true ^ showDebug = false; showMessage = true;
inspType.indexOf("Final") != -1 && balanceDue > 0 ^ message="Can't schedule " + inspType + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
inspType.indexOf("Alcohol") != -1 && balanceDue > 0 ^ message="Can't schedule " + inspType + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
inspType.indexOf("Other") != -1 && balanceDue > 0 ^ message="Can't schedule " + inspType + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
inspType.indexOf("Business") != -1 && balanceDue > 0 ^ message="Can't schedule " + inspType + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true
inspType.indexOf("Vendor") != -1 && balanceDue > 0 ^ message="Can't schedule " + inspType + ", Balance Due of $" + balanceDue ; showMessage = true ; cancel = true