import {body} from 'express-validator';

export const medicationValidationRules = [
    body('medications').isArray().withMessage('Medications must be an array'),

    body('medications.*.name')
        .isString()
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Name must contain only letters, numbers, '-' or '_'"),

    body('medications.*.weight')
        .isNumeric()
        .withMessage('Weight must be a number'),

    body('medications.*.code')
        .isString()
        .matches(/^[A-Z0-9_]+$/)
        .withMessage("Code must contain only uppercase letters, numbers, or '_'"),

    body('medications.*.image')
        .isString()
        .matches(/\.(jpg|jpeg|png|gif)$/i) // check file extension
        .withMessage('Image must be a valid picture (jpg, jpeg, png, gif)'),
];

export const loadingRequestValidationRules = [
    body('medicationIds')
        .optional()
        .isArray()
        .withMessage('medicationIds must be an array'),

    body('medicationIds.*')
        .optional()
        .isString()
        .withMessage('Each medicationId must be a string'),

    body('medications')
        .optional({ nullable: true })
        .isArray()
        .withMessage('medications must be an array'),

    body('medications.*.name')
        .if(body('medications').exists())
        .isString()
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage("Name must contain only letters, numbers, '-' or '_'"),

    body('medications.*.weight')
        .if(body('medications').exists())
        .isNumeric()
        .withMessage('Weight must be a number'),

    body('medications.*.code')
        .if(body('medications').exists())
        .isString()
        .matches(/^[A-Z0-9_]+$/)
        .withMessage("Code must contain only uppercase letters, numbers, or '_'"),

    body('medications.*.image')
        .if(body('medications').exists())
        .isString()
        .matches(/\.(jpg|jpeg|png|gif)$/i)
        .withMessage('Image must be a valid picture (jpg, jpeg, png, gif)'),
];
