import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    city: String,
    institute: String,
    educationLevel: {
        type: String,
        enum: ['Bachelor', 'Master', 'PhD', 'Other']
    },
    graduationYear: Number,
    currentPosition: String,
    currentCompany: String,
    experienceYears: Number,
    noticePeriod: String,
    reasonToSwitch: String,
    currentSalary: Number,
    expectedSalary: Number,
    expectedSalaryPartTime: Number,

    appliedPosition: String,

    resumeFile: String,
    resumeFileName: String,
    resumeFileType: {
        type: String,
        enum: ['pdf', 'docx']
    },
    loomLink: String,
    hrRemarks: String,
    interviewerRemarks: String,
    status: {
        type: String,
        default: 'New',
        enum: ['New', 'Screening', 'Interviewed', 'Pass', 'Fail', 'On Hold']
    }
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
