import { Router } from 'express';
import {
  getProfile,
  getQuestions,
  submitAssessment,
  getPortfolioData,
  addPortfolioProject,
  evaluateCode,
} from '../controllers/skillController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.get('/assessment/questions', optionalAuthenticate, getQuestions);
router.post('/assessment/submit', authenticate, submitAssessment);
router.post('/assessment/evaluate-code', optionalAuthenticate, evaluateCode);
router.get('/portfolio', authenticate, getPortfolioData);
router.post('/portfolio/projects', authenticate, addPortfolioProject);

export default router;
