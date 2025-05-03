import { z } from "zod";

export const addressSchema = z.object({
  address: z.string().min(1, "Address is required"), 
  location: z.string().min(1, "Location is required"),
  pincode: z.coerce.number().min(1, "Pincode is required"),
  contact: z.coerce.number().min(1, "Contact is required"),
});

export const employeeSchema = z.object({
  emp_id: z.coerce.number().int().positive("Employee ID must be a positive number"),
  name: z.string().min(1, "Name is required"),
  organ: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});
export const formSchema = z.object({
  emp_id: z.string().min(1, "Employee ID is required"),
  name: z.string().min(1, "Name is required"),
  organ: z.string().min(1, "Organ is required"),
  position: z.string().min(1, "Position is required"),
  addresses: z
    .array(addressSchema)
    .min(1, "At least one address is required"), 
});
const validationSchema = z.object({
  organization: z.string().nonempty("Organization is required"),
  position: z.string().nonempty("Position is required"),
});

