const { LocalDateTime, ZonedDateTime, DayOfWeek, LocalDate, ZoneId } = require("@js-joda/core")
require("@js-joda/timezone");

const functions = {

    isBankingHoliday: (date, timezone) => {

        let holidays = [];

        let mlk = functions.findDayofWeekInMonth(DayOfWeek.MONDAY, 3, 1, date.year())

        let thanksgiving = functions.findDayofWeekInMonth(DayOfWeek.THURSDAY, 4, 11, date.year())

        let presidents = functions.findDayofWeekInMonth(DayOfWeek.MONDAY, 3, 2, date.year())

        let labor = functions.findDayofWeekInMonth(DayOfWeek.MONDAY, 1, 9, date.year())

        let columbus = functions.findDayofWeekInMonth(DayOfWeek.MONDAY, 2, 10, date.year())

        if (timezone == "US/Eastern") {
        
            holidays = [1, mlk, presidents, 145, 185, labor, 285, columbus, thanksgiving, 359];

        }
        
        //in lieu of a way to calculate liturgical holidays from the lunar calendar, these will have to be hardcoded, this set is for 2020
        if (timezone === "Europe/London"){

            holidays = [1, 92, 95, 123, 151, 242, 361, 362]

        }

        if (timezone === "Asia/Hong_Kong"){

            holidays = [1, 25, 27, 28, 94, 100, 101, 103, 120, 121, 176, 182, 274, 275, 299, 359, 360];

        }

        let localDate = new LocalDate.of(date.year(), date.month(), date.dayOfMonth())


        if (localDate.isLeapYear() && localDate.dayOfYear() > 60){
            localDate = localDate.minusDays(1);
        }

        if (holidays.includes(localDate.dayOfYear())){
            return true
        } else {
            return false;
        }

    },

    findDayofWeekInMonth: (dayOfWeek, dayInMonth, month, year) => {

        let firstDayOfMonth = LocalDate.of(year, month, 1);
    
        while(firstDayOfMonth.dayOfWeek() !== dayOfWeek){
            firstDayOfMonth = firstDayOfMonth.plusDays(1)
        }
    
        firstDayOfMonth = firstDayOfMonth.plusDays((dayInMonth - 1) * 7)
    
        return firstDayOfMonth.dayOfYear();
    
    },

    isWeekend: (date) => {

        if (date.dayOfWeek() === DayOfWeek.SATURDAY || date.dayOfWeek() === DayOfWeek.SUNDAY){
            return true;
        }
        else{
            return false;
        }
    
    },

    isBeforeOpen: (date, timezone) => {
    
        let openTime = LocalDateTime;
    
    
        if (timezone == "US/Eastern"){
            openTime = date.withHour(9).withMinute(0).withSecond(0);
        }
    
        if (timezone == "Europe/London"){
            openTime = date.withHour(8).withMinute(30).withSecond(0);
        }
    
        if(timezone == "Asia/Hong_Kong"){
            openTime = date.withHour(7).withMinute(0).withSecond(0)
        }
    
        if (date.isBefore(openTime)){
            return true;
        }
        else{
            return false;
        }
    
    },

    isAfterClose: (date, timezone) => {

        
        let closeTime = LocalDateTime;
    
    
        if (timezone == "US/Eastern"){
            closeTime = date.withHour(16).withMinute(0).withSecond(0);
        }
    
        if (timezone == "Europe/London"){
            closeTime = date.withHour(17).withMinute(0).withSecond(0)
        }
    
        if(timezone == "Asia/Hong_Kong"){
            closeTime = date.withHour(16).withMinute(30).withSecond(0);
        }
    
        if (date.isAfter(closeTime)){
            return true;
        }
        else{
            return false;
        }
    
    },

    setToOpenTime: (date, timezone) => {

        if (timezone == "US/Eastern"){
            date = date.withHour(9).withMinute(0).withSecond(0);
            
        }
    
        if (timezone == "Europe/London"){
            date = date.withHour(8).withMinute(30).withSecond(0);
        }
    
        if(timezone == "Asia/Hong_Kong"){
            date = date.withHour(7).withMinute(0).withSecond(0);
        }
    
        return date;
    
    },

    isLunchbreak: (localdate, timezone) => {
        if (timezone == "Europe/London" && localdate.hour() === 12){
            return true
        }
        return false
    },

    
nextBusinessDay: (year, month, day, hour, minute, second, timezone) => {

    if (timezone != "US/Eastern" && timezone != "Europe/London" && timezone != "Asia/Hong_Kong"){
        return {"error code" : 400, "message" : "Invalid Timezone, only `US/Eastern`, `Europe/London`, or `Asia/Hong_Kong` accepted"};
    }

    var  localdate, zonedDate;

    try{
        localdate = LocalDateTime.of(year, month, day, hour, minute, second);
    }
    catch(err) {
        return {"error code" : 400, "message" : "Bad date input"};
    }

    if (functions.isBeforeOpen(localdate, timezone)) {
        localdate = functions.setToOpenTime(localdate, timezone)
      }

    if (functions.isAfterClose(localdate, timezone)){
        localdate = localdate.plusDays(1);
        localdate = functions.setToOpenTime(localdate, timezone);
      }


    while (functions.isWeekend(localdate) || functions.isBankingHoliday(localdate, timezone)){
         localdate = localdate.plusDays(1);
         localdate = functions.setToOpenTime(localdate, timezone);
        }

    if(functions.isLunchbreak(localdate, timezone)){
        localdate = localdate.withHour(13).withMinute(0).withSecond(0);
    }

    
      let zoneId= ZoneId.of(timezone)

      zonedDate = ZonedDateTime.of(localdate, zoneId);

      return zonedDate;

    }

}

module.exports = functions;


 











