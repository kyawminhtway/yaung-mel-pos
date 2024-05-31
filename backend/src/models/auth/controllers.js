import bcrypt from 'bcrypt';
import AuthError from '../../errors/authError.js';
import pool from '../../db.js';

const auth = async (req, res) => {
    var { username, password } = req.body;
    if(!username || !password){
        res.status(400).send({'error': 'Username or password cannot be empty.'})
    }
    var query = ` SELECT ID, PASSWORD FROM APP_USER WHERE USERNAME=$1 `;
    var result = await pool.query(query, [username]);
    if(result.rows.length <= 0) throw new AuthError('Username does not exist.');
    var user = result.rows[0];
    var valid = await bcrypt.compare(password, user.password);
    if(!valid) throw new AuthError('Invalid username or password!');
    return valid;
};

export default {
    auth,
};