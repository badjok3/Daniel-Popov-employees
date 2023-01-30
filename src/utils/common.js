import moment from 'moment';

export const extractCommonProjects = (data) => {
    // [WIP] Calculate diff in days between two dates
    let dateFrom = data[0]['DateFrom'],
        dateTo = data[0]['DateTo'],
        start = moment(dateFrom.replace(/\./g, ' ')),
        end = moment(dateTo.replace(/\./g, ' '))

    console.log(moment.duration(start.diff(end)).asDays());
}
