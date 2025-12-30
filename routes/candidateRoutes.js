import express from 'express';
import { getAllCandidates, addCandidate, updateCandidateData, deleteCandidate, getCandidateById } from '../controllers/candidateController.js';
import { upload } from '../middleware/multer.js';
import { protect } from '../middleware/authMiddleware.js'; // Add this import
const router = express.Router();

router.get('/candidates', protect, getAllCandidates);
router.get('/candidates/:id', protect, getCandidateById);
router.post('/candidates', protect, upload.single("resume"), addCandidate);
router.patch('/candidates/:id', protect, upload.single("resume"), updateCandidateData);
router.delete('/candidates/:id', protect, deleteCandidate);

export default router;
