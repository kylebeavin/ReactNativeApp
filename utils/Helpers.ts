import useAsyncStorage from '../hooks/useAsyncStorage';
import {HttpMethods} from '../types/enums';

//#region Summary
export const formatDateString = (oldString: string): string => {
  let newString: string = '';
  let stringArr: string[] = oldString.split('-');

  newString = newString.concat(
    stringArr[1] + '/' + stringArr[2] + '/' + stringArr[0],
  );

  return newString;
};
//#endregion

//#region Summary //This is Broke
///Function: Converts JS Date object to usable date and time strings.
///Params: A JavaScript Date.
///Returns: An object with a date string and time string for use in forms.
//#endregion
export const getDateStringsFromDate = (date: any): {date: string; time: string} => {
  let dateObject = {date: '', time: ''};
  if (date === null) return {date: 'N/A', time: 'N/A'};
  let stringArr: string[] = date.toString().split('T');
  let dateStringArr: string[] = stringArr[0].split('-');
  let dateTimeArr: string[] = stringArr[1].split('.')[0].split(':');

  // Set the date property
  dateObject.date =
    dateStringArr[1] + '/' + dateStringArr[2] + '/' + dateStringArr[0];

  // Set the time property
  dateObject.time = dateTimeArr[0] + ':' + dateTimeArr[1];

  return dateObject;
};

//#region Summary
///Function: Get the request headers interface object.
///Params: method - optional enum sets the method.
///Returns: A Headers object for fetch requests.
//#endregion
export const getRequestHeadersAsync = async (
  method?: HttpMethods,
): Promise<Headers> => {
  //const {token} = useContext(AppContext);
  let headers: Headers = new Headers();
  let token = await useAsyncStorage()
    .getUserAsync()
    .then((user) => user.token);

  // ToDo: tried to give option of setting method but ran into bug where headers kept get value then broke because of body.
  if (method) {
    headers.set('method', method.valueOf());
  }

  headers.set('Content-Type', 'application/json');
  headers.set('x-access-token', token);

  return headers;
};

export function formatDate(date: Date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export const isValidEmail = (
  email: string,
): {isValid: boolean; message: string} => {
  let validationObject = {isValid: false, message: 'Required'};
  const expression: RegExp = new RegExp(
    '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
  );

  if (!email) {
    return validationObject;
  } else if (email === '' || email.length === 0) {
    validationObject.message = 'Email Required';
    return validationObject;
  } else {
    let test = expression.test(email);
    if (test) {
      validationObject.isValid = true;
      validationObject.message = 'Email is Valid';
      return validationObject;
    }

    validationObject.message = 'Email is Not Valid';
    return validationObject;
  }
};

//#region Summary
///Function: Check an HTTP status code whether it is a success code or not.
///Params: code - number representing HTTP status code.
///Returns: True if the code is registered as a success code.
//#endregion
export const isSuccessStatusCode = (code: number): boolean => {
  let success: boolean = false;

  switch (code) {
    case 200:
      success = true;
      break;
    case 201:
      success = true;
      break;
    case 202:
      success = true;
      break;
    case 203:
      success = true;
      break;
    case 204:
      success = true;
      break;
    case 205:
      success = true;
      break;
    default:
      success = false;
  }

  return success;
};
