	

function dateDiff(date1, date2) {

    return (convertDate(date2).getTime() - convertDate(date1).getTime()) / (1000 * 60 * 60 * 24);
}

