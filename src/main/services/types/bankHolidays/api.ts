enum EndPoints {
  STATUS = '/bank-holidays.json',
  BANK_HOLIDAYS = '/bank-holidays.json'
};

interface BankHolidayEvent {
  title: string
  date: string
  notes: string
  bunting: boolean
}

interface BankHolidayDivision {
  division: string
  events: BankHolidayEvent[]
}

interface BankHolidays {
  'england-and-wales': BankHolidayDivision
  'scotland': BankHolidayDivision
  'northern-ireland': BankHolidayDivision
}

export { EndPoints, BankHolidays };
