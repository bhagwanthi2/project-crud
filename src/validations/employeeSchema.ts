import { z } from "zod";
export const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  location: z.string().min(1, "Location is required"),
  pincode: z
    .number({ invalid_type_error: "Pincode must be a number" })
    .refine((val) => /^\d{6}$/.test(val.toString()), {
      message: "Pincode must be 6 digits",
    }),
  contact: z
    .number({ invalid_type_error: "Contact must be a number" })
    .refine((val) => /^\d{10}$/.test(val.toString()), {
      message: "Contact must be 10 digits",
    }),
});

export const employeeSchema = z.object({
  emp_id: z.preprocess((val) => Number(val), z.number().int().positive("Employee ID must be a positive number")),
  name: z.string().min(1, "Name is required"),
  organ: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});
