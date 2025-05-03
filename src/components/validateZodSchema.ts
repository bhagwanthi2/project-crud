import { z } from "zod";
import { employeeSchema } from './zod';

export const validateZodSchema = (values: any) => {
  const errors: { [key: string]: string } = {};
 
  const result = employeeSchema.safeParse(values);

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const path = err.path.join(".");
      errors[path] = err.message;
    });
  }

  return errors; 
};
