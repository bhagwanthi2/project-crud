import { z } from "zod";

export const addressSchema = z.object({
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  contact: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
});

const fullSchema = z.object({
  addresses: z.array(addressSchema),
});
export const employeeSchema = z.object({
  id: z.string().optional(),
  // emp_id: z.number().min(1, "Employee ID is required"),
  emp_id: z.coerce.number().int().positive({ message: "Employee ID must be a positive number" }),

  name: z.string().min(1, "Name is required"),
  organ: z.string().min(1, "Organization is required"),
  position: z.string().min(1, "Position is required"),
  // addresses: z.array(
  //   z.object({
  //     address: z.string().min(1, "Address is required"),
  //     location: z.string().min(1, "Location is required"),
  //     pincode: z
  //       .number({
  //         invalid_type_error: "Pincode must be a number",
  //       })
  //       .refine((val) => val.toString().length === 6, {
  //         message: "Pincode must be exactly 6 digits",
  //       }),
  //     contact: z
  //       .number({
  //         invalid_type_error: "Contact must be a number",
  //       })
  //       .refine((val) => val.toString().length === 10, {
  //         message: "Contact must be exactly 10 digits",
  //       }),
  //   })
  // ),
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

