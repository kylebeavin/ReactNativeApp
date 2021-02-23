import React, {useContext, useEffect, useState} from 'react';
import {ToastContext} from '../providers/ToastProvider';

const checkProperties = (obj: any) => {
  let isEmpty = true;

  Object.keys(obj).map((key: string, index: number) => {
    obj[key].map((k: string, index: number) => {
      if (k.length !== 0) {
        isEmpty = false;
      }
    });
  });
  return isEmpty;
};

const useForm = <T, Z, Y>(
  formFields: T,
  formErrors: Z,
  formValidations: any,
  callback: () => void,
): {
  handleChange(name: string, value: any): void;
  handleSubmit(): void;
  values: T;
  errors: Z;
  setErrors: React.Dispatch<React.SetStateAction<Z>>;
} => {
  const [values, setValues] = useState<T>(formFields);
  const [errors, setErrors] = useState<Z>(formErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {show} = useContext(ToastContext); // ToDo: show error message on validation failure.

  const handleChange = (name: string, value: any) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = () => {
    let errorObject = {};

    Object.keys(formValidations).map((key: string, index: number) => {
      formValidations[key].map((errorsFor: any) => {
        let errorMsg = errorsFor(values[key]);
        if (!errorObject[key]) {
          errorObject[key] = [errorMsg];
        } else {
          let arr = errorObject[key];
          errorObject[key] = arr.concat(errorMsg);
        }
      });
    });

    // ToDo: Fix spread operator right now it is injecting the entire errorObject into the errors object instead of replacing the values.
    setErrors((prev: any) => ({
      ...prev,
      ...errorObject,
    }));

    // Debug Validation Errors by uncommenting log.
    // console.log(errorObject)
    // console.log(errors)

    setIsSubmitting(true);
  };

  const handleSubmit = () => {
    validate();
  };

  useEffect(() => {
    if (checkProperties(errors) && isSubmitting) {
      callback();
      setIsSubmitting(false);
    }
  }, [errors]);

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setErrors,
  };
};

export default useForm;
