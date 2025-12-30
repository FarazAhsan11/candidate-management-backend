import {z} from 'zod';

const CandidateValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    city: z.string().min(1, "City is required"),
    institute: z.string().min(1, "Institute is required"),
    
    educationLevel: z.enum(['Bachelor', 'Master', 'PhD', 'Other']),
    graduationYear: z.coerce.number().min(1900, "Invalid graduation year").max(new Date().getFullYear(), "Graduation year cannot be in the future"),
    currentPosition: z.string().min(1, "Current position is required"),
    currentCompany: z.string().min(1, "Current company is required"),
    experienceYears: z.coerce.number().min(0, "Experience years cannot be negative"),
    noticePeriod: z.string().min(1, "Notice period is required"),
    reasonToSwitch: z.string().min(1, "Reason to switch is required"),
    currentSalary: z.coerce.number().min(0, "Current salary cannot be negative"),
    expectedSalary: z.coerce.number().min(0, "Expected salary cannot be negative"),
    expectedSalaryPartTime: z.coerce.number().min(0, "Expected part-time salary cannot be negative").optional(),
    appliedPosition: z.string().min(1, "Applied position is required"),

    loomLink: z.string().url("Invalid URL").optional(),
    hrRemarks: z.string().optional(),
    interviewerRemarks: z.string().optional(),
    status: z.enum(['New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold']).optional(),
});

const candidateUpdateSchema = CandidateValidationSchema.partial();

export const validateCandidate = (data, validationOn="create") => {
    switch (validationOn) {
        case "create":
            return CandidateValidationSchema.safeParse(data);
        case "update":
            return candidateUpdateSchema.safeParse(data);
        default:
            return null
    }
}
