// import { z } from "zod";
import { employeeSchema } from './zod';

export function validateZodSchema(data: any) {
  const result = employeeSchema.safeParse(data);
  if (result.success) return {};

  const errors: { [key: string]: string } = {};

  for (const issue of result.error.issues) {
    const path = issue.path
      .map((segment) => (typeof segment === "number" ? `[${segment}]` : segment))
      .join(".");

    const formattedPath = path.replace(/\.(\[\d+\])/g, "$1"); // Fixes addresses.0.contact to addresses[0].contact

    errors[formattedPath] = issue.message;
  }

  return errors;
}
