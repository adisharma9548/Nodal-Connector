import { Router } from 'express';
import { auth } from '../middleware/auth';
import { resumeUpload, validateUploadMagicBytes } from '../middleware/upload';
import {
  uploadResume,
  getMyResume,
  getResumeById,
  confirmResume,
  downloadResume,
} from '../controllers/resumeController';

const router = Router();

router.post('/', auth, resumeUpload.single('file'), validateUploadMagicBytes, uploadResume);
router.get('/me', auth, getMyResume);
router.get('/:id', auth, getResumeById);
router.patch('/:id/confirm', auth, confirmResume);
router.get('/:id/download', auth, downloadResume);

export default router;
