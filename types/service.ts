import { Days, Services, ServicesPer } from "./enums";

export type Agreement = {
    _id: string;
    account_id: string;
    group_id: string;
    is_recurring: boolean;
    services: Services;
    service_frequency: string;
    service_per: ServicesPer;
    service_days: Days;
    monthly_rate: string;
    demand_rate: string;
    term_date: string;
    start_date: Date;
    end_date: Date;
    created: Date;
    is_active: boolean;
    notes: string; 
    url: string;
}

export type Order = {
    _id: string;
    account_id: string;
    group_id: string;
    is_recurring: boolean;
    services: string;
    service_frequency: string;
    service_per: string;
    service_days: string;
    monthly_rate: string;
    demand_rate: string;
    term_date: string;
    start_date: string;
    end_date: string;
    created: string;
    is_demo: boolean;
    is_active: boolean;
    notes: string;
    url: string;
}

export type Demo = {
    _id: string;
    account_id: string;
    created: Date;
}