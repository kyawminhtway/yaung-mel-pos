import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import ValidationError from '../../errors/validationError.js';
import pool from '../../db.js';

const auth = async (req, res) => {
    var { username, password } = req.body;
    if(!username || !password) throw new ValidationError('Username or password cannot be empty.');
    var query = ` SELECT ID, PASSWORD FROM APP_USER WHERE USERNAME=$1 `;
    var result = await pool.query(query, [username]);
    if(result.rows.length <= 0) throw new ValidationError('Username does not exist.');
    var user = result.rows[0];
    var valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new ValidationError('Invalid username or password!');
    var csrfToken = crypto.createHmac('sha256', process.env.csrfTokenSecre)
                    .update(`${uuidv4()}-${username}`)
                    .digest('hex');
    req.session.uid = user.id;
    req.session.csrfToken = csrfToken;
    res.send({status: 'success', csrfToken});
};

export default {
    auth,
};