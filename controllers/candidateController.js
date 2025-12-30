
import Candidates from "../models/candidate.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { validateCandidate } from "../validators/candidateValidator.js";

export const getAllCandidates = async (req, res) => {
  try {
    const {
      search,
      position,
      status,
      experience,
      sortBy = 'date-desc',  
      page = 1,            
      limit = 6,             
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { appliedPosition: { $regex: search, $options: 'i' } },
      ];
    }

    if (position && position !== 'All') {
      filter.appliedPosition = position;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (experience && experience !== 'All') {
      if (experience === '0-2') {
        filter.experienceYears = { $lte: 2 };
      } else if (experience === '3-5') {
        filter.experienceYears = { $gte: 3, $lte: 5 };
      } else if (experience === '6+') {
        filter.experienceYears = { $gte: 6 };
      }
    }

    let sort = {};
    switch (sortBy) {
      case 'name-asc':
        sort = { name: 1 };       
        break;
      case 'name-desc':
        sort = { name: -1 };    
        break;
      case 'experience-asc':
        sort = { experienceYears: 1 };   
        break;
      case 'experience-desc':
        sort = { experienceYears: -1 }; 
        break;
      case 'date-asc':
        sort = { createdAt: 1 };
        break;
      case 'date-desc':
      default:
        sort = { createdAt: -1 };  
        break;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [candidates, total] = await Promise.all([
      Candidates.find(filter).sort(sort).skip(skip).limit(limitNum),
      Candidates.countDocuments(filter),  
    ]);

    const positions = await Candidates.distinct('appliedPosition');

    res.status(200).json({
      candidates,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
      positions,  
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = await Candidates.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate", error });
  }
};

export const addCandidate = async (req, res) => {
  try {
    const { success, error, data } = validateCandidate(req.body);
    if (!success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }
    const candidateData = data;
    const resume = req.file;
    let result;
    if (resume) {
      result = await uploadOnCloudinary(resume.path);
    
    if (!result) {
      return res.status(500).json({ message: "Failed to upload resume" });
    }
    candidateData.resumeFile = result.secure_url;
    candidateData.resumeFileName = resume.filename;
    candidateData.resumeFileType = resume.mimetype.split("/").pop();
  }
    const newCandidate = new Candidates(candidateData);
    await newCandidate.save();
    res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error });
  }
};

export const updateCandidateData = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { success, error, data } = validateCandidate(req.body, "update");
    if (!success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }
    const updatedData = data;
    const resume = req.file;
    let result;
    if (resume) {
      result = await uploadOnCloudinary(resume.path);
      if (!result) {
      return res.status(500).json({ message: "Failed to upload resume" });
    }
      updatedData.resumeFile = result.secure_url;
      updatedData.resumeFileName = resume.filename;
      updatedData.resumeFileType = resume.mimetype.split("/").pop();
    }
    
    const updatedCandidate = await Candidates.findByIdAndUpdate(
      candidateId,
      updatedData,
      { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
   res
  .status(200)
  .json({ message: "Candidate updated successfully", candidate: updatedCandidate });

  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const deletedCandidate = await Candidates.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error });
  }
};
