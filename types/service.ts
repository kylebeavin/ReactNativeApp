import { Days, Services, ServicesPer } from "./enums";

export type Agreement = {
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
    is_active: boolean;
    notes: string; 
    url: string;
}

export type Order = {
    _id: string;
    order_id: string;
    agreement_id?: string;
    account_id: {account_name: string};
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
    order_status: string;
}

export type Demo = {
    _id: string;
    account_id: string;
    created: string;
}