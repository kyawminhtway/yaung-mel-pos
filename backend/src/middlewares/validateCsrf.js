import AccessError from "../errors/accessError.js";

const HTTPMethodsToCheck = [
    'POST',
    'PATCH',
    'DELETE',
];
const ValidateCSRF = (req, res, next) => {
    if(!HTTPMethodsToCheck.includes(req.method)) return next();
    var headers = req.headers;
    var csrfToken = headers['x-xsrf-token'];
    if(!csrfToken) throw new AccessError('Missing CSRF token!');
    if(csrfToken !== req.session.csrfToken) throw new AccessError('Invalid CSRF Token!');
    next();
};

export default ValidateCSRF;