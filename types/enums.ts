export enum ActionType {
  add = 'ADD',
  delete = 'DELETE',
  updateStatus = 'UPDATE',
}

export enum Status {
  active = 'Active',
  inactive = 'Inactive',
}

export enum ContactRole {
  billing = 'Billing',
  notifications = 'Notifications',
  hauling = 'Hauling',
}

export enum HttpMethods {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

export enum Services {
  smash = 'smash',
  hourly = 'hourly_smashing',
  monthly = 'monthly_recurring_charge',
  haul = 'haul_charge',
  lease = 'lease_fee',
  delivery = 'delivery_charge',
  drop = 'drop_fee',
  environment = 'environmental_recovery_fee',
  blocked = 'blocked_fee',
  card = 'card_processing_fee',
  fuel = 'fuel_surcharge',
  statement = 'statement_fee',
  past = 'past_due',
  discount = 'discount',
  misc = 'misc',
}

export enum ServicesPer {
  day = 'day',
  week = 'week',
  biweek = 'bi-week',
  month = 'month',
}

export enum Days {
  sun = 'sun',
  mon = 'mon',
  tue = 'tue',
  wed = 'wed',
  thu = 'thu',
  fri = 'fri',
  sat = 'sat',
}

export enum Months {
  jan = 'January',
  feb = 'February',
  mar = 'March',
  apr = 'April',
  may = 'May',
  jun = 'June',
  jul = 'July',
  aug = 'August',
  sep = 'September',
  oct = 'October',
  nov = 'November',
  dec = 'December',
}

export enum SortOrdersList {
  distance = 'By Distance',
  stops = 'By Stops',
}

export enum ContactType {
  bill = 'bill',
  smash = 'smash',
  haul = 'haul',
}

export enum ContactMethod {
  email = 'email',
  sms = 'sms',
}

export enum TruckServiceStatus {
  good = 'Good',
  serviceRequired = 'Service Required',
}

export enum VehicleType {
  smashTruck = 'Smash Truck',
  superhauler = 'Super Hauler 9001',
  superMega = 'Super Mega Smash Machine 9002',
}

export enum RouteEvents {
  routeEvents = 'Route Events',
}

export enum SMT_Roles {
  corporate = 'corporate',
  admin = 'admin',
  partner = 'partner',
  gm = 'gm',
  sales = 'sales',
  driver = 'driver',
  mechanic = 'mechanic',
}

export enum RouteStages {
  empty = 'Empty',
  built = 'Built',
  routed = 'Routed',
  assigned = 'Assigned',
  inspected = 'Inspected',
  finalized = 'Finalized',
  completed = 'Completed',
}

export enum OrderStatus {
  notStarted = 'Not Started',
  started = 'Started',
  completed = 'Completed',
  cancelled = 'Cancelled',
}

export enum FuelPercentage {
  ten = '10%',
  twenty = '20%',
  thirty = '30%',
  forty = '40%',
  fifty = '50%',
  sixty = '60%',
  seventy = '70%',
  eighty = '80%',
  ninety = '90%',
  hundred = '100%',
}
