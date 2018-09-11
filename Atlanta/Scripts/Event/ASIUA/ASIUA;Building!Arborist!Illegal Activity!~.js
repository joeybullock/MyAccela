true ^ showDebug = false; showMessage = false;
{Illegal Recompense Fee} != null ^ updateFee("ILLEGAL-REC","ARBORIST", "FINAL", {Illegal Recompense Fee}, "N");
{Penalty (known trees)} != null ^ updateFee("PEN-KNOWN","ARBORIST", "FINAL", {Penalty (known trees)}, "N");
{Penalty (unknown trees)} != null ^ updateFee("PEN-UNKNOWN","ARBORIST", "FINAL", {Penalty (unknown trees)}, "N");
{Replacement credit} != null ^ updateFee("REPL-CREDIT","ARBORIST", "FINAL", {Replacement credit}, "N");