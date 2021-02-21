export type Account = {
    _id: string;
    group_id: string[];
    account_name: string;
    owner_id: string;
    contacts: Contact[];
    is_active: boolean;
    stage: string;
    geo_location: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    email: string;
    created: string;
    demo: string;
    conversion: Date;
    hauling_contract: boolean;
    hauling_expiration: string;
    national: boolean;
    owner_name: string;
    referral: boolean;
    referral_group_id: string;
    notes: string[];
  
    // UI properties
    drawerIsVisible: boolean;
  }
  
  export type Contact = {
    _id: string;
    account_id: string;
    owner_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    type: string;
    method: string;
    createdAt: string;
    is_active: boolean;
  }
  
  export type Location = {
    _id: string;
    account_id: string;
    group_id: string;
    location_name: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    created: string;
    is_active: boolean;
  }
  
  export type Meeting = {
    _id: string;
    group_id: string;
    account_id: string;
    contact_id: string;
    owner_id: string;
    title: string;
    address_street: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    created: string;
    meeting_time: Date;
    is_active: boolean;
    notes: string;
  }