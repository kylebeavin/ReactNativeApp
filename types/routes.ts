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
  route_id: string;
  truck_id?: string;
  inspection_id: string;
  is_active: boolean;
  route_stage: string;
  start_location: string;
  driver_id?: string;
  truck_vin: string;
  service_stop: string[];
  time: Date;
  notes: string;
}

export type PreTripInspection = {
  // Identify truck
  _id: string;
	group_id: string;
	owner_id: string;
	is_active: boolean;
	type: string;
	truck_id: string;
    
  // Truck Checklist
	odometer_reading: string;
	fuel_level: string;
	seat_belts: boolean;
	pto_switch: boolean;
	engine_fluids: boolean;
	transmission: boolean;
	steering_mechanism: boolean;
	horn: boolean;
	windshield_wipers: boolean;
	mirrors: boolean;
	truck_lights: boolean;
	parking_brake: boolean;
	service_brake: boolean;
	tires: boolean;
	rims: boolean;
	emergency_equipment: boolean;
	tools_gear: boolean;
  chocks_chains: boolean;
  
  // Smash Unit Checklist
  drum_cap: boolean
  grease_distribution: boolean
  chain_tension: boolean
  machine_lights: boolean
  machine_hours: string

  // Sign-Off Checklist
  vehicle_condition: boolean
  required_documents: Array<string>
  engine_warning: boolean
  drivers_signature: string // will point to url of driver signature image.
}