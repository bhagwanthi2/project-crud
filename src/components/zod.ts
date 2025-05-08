import { z } from "zod";



export const addressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  location: z.string().min(1, 'Location is required'),
  pincode: z.number().min(100000, 'Pincode must be 6 digits').max(999999, 'Pincode must be 6 digits'),
  contact: z.number().min(1000000000, 'Contact must be a valid phone number').max(9999999999, 'Contact must be a valid phone number'),
});

export const employeeSchema = z.object({
  emp_id: z.number().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  organ: z.string().min(1, 'Organization is required'),
  position: z.string().min(1, 'Position is required'),
  addresses: z.array(addressSchema),
});
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

