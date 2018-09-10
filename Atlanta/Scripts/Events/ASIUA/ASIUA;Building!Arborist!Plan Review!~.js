true ^ showDebug = false; showMessage = false;
{Standard Recompense Fee} != null && {Recompense Type} =="Standard Recompense" ^ updateFee("STAN-REC","ARBORIST", "FINAL", {Standard Recompense Fee}, "N");
{Replacement credit} != null ^ updateFee("REPL-CREDIT","ARBORIST", "FINAL", {Replacement credit}, "N");
{Easement Credit} != null ^ updateFee("CON-EASE","ARBORIST", "FINAL", {Easement Credit}, "N");
{Maximum Recompense Fee} != null && {Recompense Type} =="Maximum Recompense" ^ updateFee("MAX-REC","ARBORIST", "FINAL", {Maximum Recompense Fee}, "N"); updateFee("REPL-CREDIT","ARBORIST", "FINAL", {Replacement credit}, "N"); updateFee("CON-EASE","ARBORIST", "FINAL", {Easement Credit}, "N");