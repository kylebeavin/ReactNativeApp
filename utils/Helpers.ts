//#region Summary
// Function: Split string into array then rebuilds it like MM/DD/YYYY
// Params: takes in a react-native-calendar dateString
// Returns: Our formatted string for forms

import useAsyncStorage from "../hooks/useAsyncStorage";
import { HttpMethods } from "../types/enums";

//#endregion 
export const formatDateString = (oldString: string) :string => {
    let newString :string = "";
    let stringArr : string[] = oldString.split("-");
    
    newString = newString.concat(stringArr[1] + "/" + stringArr[2] + "/" + stringArr[0]);
    
    return newString;
}

//#region Summary //This is Broke
///Function: Converts JS Date object to usable date and time strings.
///Params: A JavaScript Date.
///Returns: An object with a date string and time string for use in forms.
//#endregion
export const getDateStringsFromDate = (date: Date) : {date: string, time: string} => {
    let dateObject = {date: "", time: ""};
    let stringArr: string[] = date.toString().split("T")
    let dateStringArr: string[] = stringArr[0].split("-");
    let dateTimeArr: string[] = stringArr[1].split(".")[0].split(":");

    // Set the date property
    dateObject.date = dateStringArr[1] + "/" + dateStringArr[2] + "/" + dateStringArr[0];

    // Set the time property
    dateObject.time = dateTimeArr[0] + ":" + dateTimeArr[1];

    return dateObject;
}

//#region Summary
///Function: Get the request headers interface object.
///Params: method - optional enum sets the method.
///Returns: A Headers object for fetch requests.
//#endregion
export const getRequestHeadersAsync = async (method?: HttpMethods) : Promise<Headers> => {
    let headers : Headers = new Headers();
    let token = await useAsyncStorage().getUserAsync().then(user => user.token)

    // ToDo: tried to give option of setting method but ran into bug where headers kept get value then broke because of body.
    if (method) {
        headers.set("method", method.valueOf());
    }
    
    headers.set("Content-Type", "application/json");
    headers.set("x-access-token", token);
    
    return headers;
}

export function formatDate(date: Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// import * as validator from "validator";
// import { UserAuth } from "../custom-types";
// import { DEFAULT_USER_AUTH } from "./Consts";

// /** Handle form validation for the login form
//  * @param email - user's auth email
//  * @param password - user's auth password
//  * @param setError - function that handles updating error state value
//  */
// export const validateLoginForm = (
//   email: string,
//   password: string,
//   setError: (error: string | null) => void
// ): boolean => {
//   // Check for undefined or empty input fields
//   if (!email || !password) {
//     setError("Please enter a valid email and password.");
//     return false;
//   }

//   // Validate email
//   if (!validator.isEmail(email)) {
//     setError("Please enter a valid email address.");
//     return false;
//   }

//   return true;
// };

// /** Return user auth from local storage value */
// export const getStoredUserAuth = (): UserAuth => {
//   const auth = window.localStorage.getItem("UserAuth");
//   if (auth) {
//     return JSON.parse(auth);
//   }
//   return DEFAULT_USER_AUTH;
// };

// /**
//  * API Request handler
//  * @param url - api endpoint
//  * @param method - http method
//  * @param bodyParams - body parameters of request
//  */

// export const apiRequest = async (
//   url: string,
//   method: string,
//   bodyParams?: { email: string; password: string }
// ): Promise<any> => {
//   const response = await fetch(url, {
//     method,
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: bodyParams ? JSON.stringify(bodyParams) : undefined
//   });

//   return await response.json();
// };