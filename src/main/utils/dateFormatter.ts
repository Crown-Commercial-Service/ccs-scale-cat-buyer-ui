import {Moment} from 'moment'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const LONG_DATE_FORMAT = 'D MMMM YYYY'
export const LONG_DATE_DAY_FORMAT = 'dddd D MMMM YYYY'
export const TIME_FORMAT = 'h:mma'
export const INPUT_DATE_FORMAT = 'D M YYYY'

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

  static formatDayDate (value: Moment): string {
    return value.format(LONG_DATE_DAY_FORMAT)
  }

  static formatLongDateAndTime (value: Moment): string {
    return `${DateFormater.formatLongDate(value)} at ${value.format(TIME_FORMAT)}`
  }

}
