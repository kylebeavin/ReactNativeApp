//=== Auth Types ===//
export type SMT_User = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token: string;
  image: string;
  role: string;
  group_id: string;
  created: string;
  is_active: boolean;
};