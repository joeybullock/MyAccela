
function asiTableValObj(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;
	this.hasValue = Boolean(fieldValue != null & fieldValue != "");

	asiTableValObj.prototype.toString=function(){ return this.hasValue ? String(this.fieldValue) : String(""); }
};