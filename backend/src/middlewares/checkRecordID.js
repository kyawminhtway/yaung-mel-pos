import ValidationError from '../errors/validationError.js';

const CheckRecordID = (req, res, next) => {
    if(isNaN(req.params.id)) throw new ValidationError('Invalid record ID or missing record ID!');
    next();
};

export default CheckRecordID;