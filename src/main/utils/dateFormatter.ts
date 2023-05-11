import { Moment } from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'
const LONG_DATE_FORMAT = 'D MMMM YYYY'
const LONG_DATE_DAY_FORMAT = 'dddd D MMMM YYYY'
const TIME_FORMAT = 'h:mma'
const INPUT_DATE_FORMAT = 'D M YYYY'
const DATE_FORMAT_DDMMYYYY = 'DD/MM/YYYY'
const DATE_FORMAT_HHMMDDMMYYYY = 'HH:mm / DD/MM/YYYY'
const DATE_FORMAT_DD_MM_YYYY = 'DD-MM-YYYY'

class DateFormater {
  static formatDate (value: Moment): string {
    return value.format(DATE_FORMAT)
  }

  static formatInputDate (value: Moment): string {
    return value.format(INPUT_DATE_FORMAT)
  }

  static formatLongDate (value: Moment): string {
    return value.format(LONG_DATE_FORMAT)
  }

  static formatDateDDMMYYYY (value: Moment): string {
    return value.format(DATE_FORMAT_DDMMYYYY)
  }

  static formatDateHHMMDDMMYYYY (value: Moment): string {
    return value.utc().format(DATE_FORMAT_HHMMDDMMYYYY)
  }

  static formatDateDD_MM_YYYY (value: Moment): string {
    return value.format(DATE_FORMAT_DD_MM_YYYY)
  }

  static formatDayDate (value: Moment): string {
    return value.format(LONG_DATE_DAY_FORMAT)
  }

  static formatLongDateAndTime (value: Moment): string {
    return `${DateFormater.formatLongDate(value)} at ${value.format(TIME_FORMAT)}`
  }
}

export { DateFormater }
