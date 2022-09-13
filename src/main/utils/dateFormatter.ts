import {Moment} from 'moment'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const LONG_DATE_FORMAT = 'D MMMM YYYY'
export const LONG_DATE_DAY_FORMAT = 'dddd D MMMM YYYY'
export const TIME_FORMAT = 'hh:mm a'
export const INPUT_DATE_FORMAT = 'D M YYYY'
export const DATE_FORMAT_DDMMYYYY = 'DD/MM/YYYY'
export const DATE_FORMAT_DD_MM_YYYY = 'DD-MM-YYYY'
export const MEDIUM_DATE_FORMAT='D MMMM y,h:mm a'

export class DateFormater {

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

  static formatDateDD_MM_YYYY (value: Moment): string {
    return value.format(DATE_FORMAT_DD_MM_YYYY)
  }

  static formatDayDate (value: Moment): string {
    return value.format(LONG_DATE_DAY_FORMAT)
  }

  static formatLongDateAndTime (value: Moment): string {
    return `${DateFormater.formatLongDate(value)} at ${value.format(TIME_FORMAT)}`
  }
  static formatTimeHHMM (value: Moment): string {
    return value.format(TIME_FORMAT);
  }
  static formatMMMdyhmsa (value: Moment): string {
    return value.format(MEDIUM_DATE_FORMAT);
  }
}
