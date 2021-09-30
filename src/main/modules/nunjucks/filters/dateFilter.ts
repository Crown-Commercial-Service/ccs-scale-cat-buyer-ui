import  moment from 'moment'
import { DateFormater } from '../../../utils/dateFormatter'
import { MomentFactory } from '../../../utils/momentFactory'
import { calculateMonthIncrement } from '../../../utils/calculateMonthIncrement'


export function dateFilter (value: moment.Moment | string): string {
    try {
      if (!value || !(typeof value === 'string' || value instanceof moment)) {
        throw new Error('Input should be moment or string, cannot be empty')
      }
  
      const date: moment.Moment = typeof value === 'string' ? moment(value) : value
      if (!date.isValid()) {
        throw new Error('Invalid date')
      }
      return DateFormater.formatLongDate(date)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  
  export function dateInputFilter (value: moment.Moment | string): string {
    try {
      if (!value || !(typeof value === 'string' || value instanceof moment)) {
        throw new Error('Input should be moment or string, cannot be empty')
      }
  
      const date: moment.Moment = typeof value === 'string' ? moment(value) : value
      if (!date.isValid()) {
        throw new Error('Invalid date')
      }
      return DateFormater.formatInputDate(date)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  

  export function dateWithDayAtFrontFilter (value: moment.Moment | string): string {
    try {
      if (!value || !(typeof value === 'string' || value instanceof moment)) {
        throw new Error('Input should be moment or string, cannot be empty')
      }
  
      const date: moment.Moment = typeof value === 'string' ? moment(value) : value
      if (!date.isValid()) {
        throw new Error('Invalid date')
      }
      return DateFormater.formatDayDate(date)
    } catch (err) {
      console.log(err)
      throw err
    }
  }


  export function addDaysFilter (value: moment.Moment | string, num: number): moment.Moment {
    try {
      if (!value || !(typeof value === 'string' || value instanceof moment)) {
        throw new Error('Input should be moment or string, cannot be empty')
      }
  
      let date: moment.Moment
      if (typeof value === 'string') {
        if (value === 'now') {
          date = MomentFactory.currentDate()
        } else {
          date = moment(value)
        }
      } else {
        date = value.clone()
      }
      if (!date.isValid()) {
        throw new Error('Invalid date')
      }
      return date.add(num, 'day')
    } catch (err) {
     console.log(err)
      throw err
    }
  }




  export function monthIncrementFilter (value: moment.Moment | string): moment.Moment {
  try {
    if (!value || !(typeof value === 'string' || value instanceof moment)) {
      throw new Error('Input should be moment or string, cannot be empty')
    }

    let date: moment.Moment
    if (typeof value === 'string') {
      if (value === 'now') {
        date = moment()
      } else {
        date = moment(value)
      }
    } else {
      date = value
    }
    if (!date.isValid()) {
      throw new Error('Invalid date')
    }
    return calculateMonthIncrement(date)
  } catch (err) {
    console.log(err)
    throw err
  }
}