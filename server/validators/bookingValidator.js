import { body } from 'express-validator';

export const createBookingValidation = [
  body('destination').isMongoId().withMessage('Valid destination ID required'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('travelers').isInt({ min: 1 }).withMessage('At least 1 traveler required'),
  body('contactInfo.name').notEmpty().withMessage('Contact name required'),
  body('contactInfo.email').isEmail().withMessage('Valid contact email required'),
];
