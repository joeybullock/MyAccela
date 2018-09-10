 function getDateDiff(DatetoComp) {

    var date1 = new Date(DatetoComp);
    var sysDate = aa.date.getCurrentDate();
    var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "MM/DD/YYYY");
    //aa.print("sysDateMMDDYYYY:" + sysDateMMDDYYYY + "--DatetoComp:" + DatetoComp);

    var date2 = new Date(sysDateMMDDYYYY);
    var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));
    //aa.print("diffDays:" + diffDays);
    return diffDays;
}

