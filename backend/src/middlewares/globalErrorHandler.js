import AuthError from "../errors/authError.js";
import AccessError from "../errors/accessError.js";
import ValidationError from "../errors/validationError.js";
import logger from "../logger.js";

const globalErrorHandler = (err, req, res, next) => {
    if(err instanceof ValidationError){
        var message = err.serializeError();
        logger.log('error', err.stack);
        return res.status(400).send(message);
    }
    if(err instanceof AccessError){
        var message = err.serializeError();
        logger.log('error', err.stack);
        return res.status(401).send(message);
    }
    if(err instanceof AuthError){
        var message = err.serializeError();
        logger.log('error', err.stack);
        return res.status(403).send(message);
    }
    logger.log('error', err.stack);
    res.status(500).send({'message': 'Internal Server Error', 'details': err.stack});
};

export default globalErrorHandler;