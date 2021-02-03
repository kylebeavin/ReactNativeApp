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

//=== Validators ===//
export interface IValidator {
  isValid: boolean;
  message: string;
  isVisible: boolean;
}

export class Validator implements IValidator {
  isValid: boolean = false;
  message: string = "";
  isVisible: boolean = false;
}