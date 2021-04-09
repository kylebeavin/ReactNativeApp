import {Days, Services, ServicesPer} from './enums';

export type Agreement = {
  _id: string;
  account_id: string;
  group_id: string;
  is_recurring: boolean;
  services: string;
  service_frequency: string;
  service_per: string;
  service_days: string;
  recurring_rate: string;
  demand_rate: string;
  term_date: string;
  start_date: string;
  end_date: string;
  created: string;
  is_active: boolean;
  notes: string;
  url: string;
};

export type Order = {
  _id: string;
  account_id: string;
  agreement_id?: string;
  containers_serviced?: number;
  completed_geo_location?: string;
  completed_time?: Date;
  container_qty: Number;
  demand_rate: string;
  group_id: string;
  haul_status: boolean;
  is_active: boolean;
  is_demo: boolean;
  is_recurring: boolean;
  monthly_rate: string;
  location: string;
  notes: string[];
  order_id: string;
  order_status: string;
  services: string;
  service_date: string;
  service_day: string;
  service_frequency: string;
  url: string[];

  // UI 
  account_name: string;
};

export type Demo = {
  _id: string;
  account_id: string;
  created: string;
};
