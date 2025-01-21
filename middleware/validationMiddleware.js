import { validateSchema } from '../utils/validationUtils.js';

const validateRequest =(schema) => async (req, res, next) => {
    const errors = await validateSchema(schema, req.body);
    if (errors) {
        return res.status(400).json({status:400, message:errors });
    }
    next();
};

export{
    validateRequest
}