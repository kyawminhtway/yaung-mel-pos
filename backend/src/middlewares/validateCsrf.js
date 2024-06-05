import AccessError from "../errors/accessError.js";

const ValidateCSRF = (req, res, next) => {
    if(req.method !== 'POST') return next();
    var headers = req.headers;
    var csrfToken = headers['x-xsrf-token'];
    if(!csrfToken) throw new AccessError('Missing CSRF token!');
    if(csrfToken !== req.session.csrfToken) throw new AccessError('Invalid CSRF Token!');
    next();
};

export default ValidateCSRF;