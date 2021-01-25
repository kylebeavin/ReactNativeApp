export enum ActionType {
    add = "ADD",
    delete = "DELETE",
    updateStatus = "UPDATE"
};

export enum Status {
    active = "Active",
    inactive = "Inactive"
};

export enum ContactRole {
    billing = "Billing",
    notifications = "Notifications",
    hauling = "Hauling",
};

export enum HttpMethods {
    get = "GET",
    post = "POST",
    put = "PUT",
    delete = "DELETE",
};

export enum Services {
    smash = "smash",
    hourly = "hourly_smashing",
    monthly = "monthly_recurring_charge",
    haul = "haul_charge",
    lease = "lease_fee",
    delivery = "delivery_charge",
    drop = "drop_fee",
    environment = "environmental_recovery_fee",
    blocked = "blocked_fee",
    card = "card_processing_fee",
    fuel = "fuel_surcharge",
    statement = "statement_fee",
    past = "past_due",
    discount = "discount",
    misc = "misc"
}

export enum ServicesPer {
    day = "day",
    week = "week",
    month = "month",
}

export enum Days {
    sun = "sun",
    mon = "mon",
    tue = "tue",
    wed = "wed",
    thu = "thu",
    fri = "fri",
    sat = "sat"
}

export enum SortOrdersList {
    distance = "By Distance",
    stops = "By Stops",
}

export enum ContactType {
    bill = "bill",
    smash = "smash",
    haul = "haul",
}

export enum ContactMethod {
    email = "email",
    sms = "sms",
}