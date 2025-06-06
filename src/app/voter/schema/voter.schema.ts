import { z } from 'zod';

export const voterProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nationality: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
  governmentId: z.object({
    type: z.enum(['NATIONAL_ID', 'PASSPORT', 'DRIVING_LICENSE']),
    number: z.string(),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  biometricData: z.object({
    type: z.enum(['FINGERPRINT', 'FACIAL']),
    hash: z.string(), // Store only the hash of biometric data
  }).optional(),
  isVerified: z.boolean().default(false),
  verificationStatus: z.enum(['PENDING', 'VERIFIED', 'REJECTED']).default('PENDING'),
});

export const voterRegistrationSchema = voterProfileSchema.extend({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  nationality: z.string().min(1, { message: "Nationality is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  governmentId: z.string().min(1, { message: "Government ID is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type VoterProfileDto = z.infer<typeof voterProfileSchema>;
export type VoterRegistrationDto = z.infer<typeof voterRegistrationSchema>;
