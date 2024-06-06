import pool from '../db.js';
import AuthError from "../errors/authError.js";

const CheckAuth = (req, res, next) => {
    if(!req.session.uid || !req.session.csrfToken) throw new AuthError('Please log in to the system first.');
    req.env = {
        uid: req.session.uid,
        pool: pool,
    };
    next();
};

export default CheckAuth;