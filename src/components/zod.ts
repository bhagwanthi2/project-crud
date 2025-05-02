import { z } from "zod";

export const addressSchema = z.object({
  location: z.string().min(1, "Location is required"),
  pincode: z.number().int().min(100000, "Invalid pincode").max(999999, "Invalid pincode"),
  contact: z.number().int().min(1000000000, "Invalid contact number").max(9999999999, "Invalid contact number"),
});

export const employeeSchema = z.object({
  emp_id: z.number().int().positive("Employee ID must be a positive number"),
  name: z.string().min(1, "Name is required"),
  organ: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  addresses: z.array(addressSchema).min(1, "At least one address is required"),
});

// TypeScript inferred type (optional)
export type EmployeeFormData = z.infer<typeof employeeSchema>;
// export default employeeSchema;