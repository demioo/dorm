import { ValidationError } from 'yup';

type FormattedError = {
  path: string;
  message: string;
}

export const formatYupError = (err: ValidationError): FormattedError[] => {
  const errors: Array<{ path: string; message: string }> = [];
  err.inner.forEach(e => {
    errors.push(
      {
        path: e.path as string,
        message: e.message
      }
    );
  });
  return errors;
};