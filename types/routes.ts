export type Truck = {
    _id: string;
    body_subtype: string;
    body_type: string;
    color: string;
    documents: string[];
    group_id: string[];
    hours: string;
    is_active: boolean;
    license_number: string;
    msrp: string;
    name: string;
    odo: string;
    operator: string;
    ownership: string;
    pictures: string[];
    service_history: string[];
    service_status: string;
    trim: string;
    registration: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_type: string;
    vin: string;
    year: string;
}

export type Route = {
  _id: string;
  group_id: string;
  truck_id: string;
  is_active: boolean;
  start_location: string;
  driver: string;
  truck_vin: string;
  service_stop: string[];
  time: Date;
  notes: string;
}

export type Inspection = {
    
}