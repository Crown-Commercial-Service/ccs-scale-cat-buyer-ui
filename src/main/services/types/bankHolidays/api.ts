type EndPoints = {
  bankHolidays: string
};

type BankHolidayEvent = {
  title: string
  date: string
  notes: string
  bunting: boolean
}

type BankHolidayDivision = {
  division: string
  events: BankHolidayEvent[]
}

type BankHolidays = {
  'england-and-wales': BankHolidayDivision
  'scotland': BankHolidayDivision
  'northern-ireland': BankHolidayDivision
}

export { EndPoints, BankHolidays };
