import {isNullOrEmpty} from "./commonUtils";

export const getDayStartInUTCFor=(date)=>{
    const dateObj = new Date(date)
    return getDayStartInUTC(dateObj.getDate(),dateObj.getMonth(),date.getFullYear())
}

export const getDayStartInUTC = (date, month, year) => {
    // This will return UTC date start with given date month and year
    return new Date(Date.UTC(year, month, date, 0, 0, 0));
}

export const formatDate = (date=null, format = "") => {
    if (isNullOrEmpty(format) || isNullOrEmpty(date)) return ""
    const dateObj = new Date(date)
    switch (format) {
        case "ddd, dd MMM": {
            const day = new Intl.DateTimeFormat('en-GB', {day: '2-digit'}).format(dateObj);
            const month = new Intl.DateTimeFormat('en-GB', {month: 'long'}).format(dateObj);
            const weekday = new Intl.DateTimeFormat('en-GB', {weekday: 'long'}).format(dateObj);
            return `${day} ${month}, ${weekday}`;
        }
        case "ISOString": {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T00:00:00.000+00:00`;
        }
    }


}

export const getPreviousDate = (date,daysToSubtract=1) => {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - daysToSubtract);
    return previousDate;
}

export const getNextDate = (date,daysToAdd=1) => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    return nextDate;
};

export const isFirstDayOfMonth = (date) => {
    return date.getDate() === 1;
};

export const isLastDayOfMonth = (date) => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const lastDayOfMonth = new Date(nextMonth - 1).getDate();
    return date.getDate() === lastDayOfMonth;
};