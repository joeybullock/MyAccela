function zeroPad(num,count)
{ 
var numZeropad = num + '';
while(numZeropad.length < count) {

numZeropad = "0" + numZeropad; 
}
return numZeropad;
}