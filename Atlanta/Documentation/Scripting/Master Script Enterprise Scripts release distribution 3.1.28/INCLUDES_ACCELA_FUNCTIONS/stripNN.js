function stripNN(fullStr) {
    var allowed = "0123456789.";
    var stripped = "";
    for (i = 0; i < fullStr.length(); i++)
        if (allowed.indexOf(String.fromCharCode(fullStr.charAt(i))) >= 0)
        stripped += String.fromCharCode(fullStr.charAt(i))
    return stripped;
}
