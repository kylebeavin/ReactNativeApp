export const isRequired = (val: string) => {
  return val.length > 0 ? '' : 'Can not be blank';
};

export const isEmail = (val: string) => {
  const ai = val.indexOf('@');
  const gdi = val
    .split('')
    .reduce((acc: any, char: any, i: any) => (char === '.' ? i : acc), 0);
  return ai > -1 && gdi > ai ? '' : 'Must be an email';
};

export const validate = (values: any) => {
    let errors = {email: "", password: ""};
    if (!values.email) {

    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid";
    }
    if (!values.password) {
        errors.password = "Password is required";
    } else if (values.password.length < 10) {
        errors.password = "Password needs to be more than 10 characters";
    }
    return errors;
}