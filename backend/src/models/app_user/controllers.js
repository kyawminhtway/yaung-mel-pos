import bcrypt from 'bcrypt';
import ValidationError from '../../errors/validationError.js';

const createAppUser = async (req, res) => {
    const { name, username, password } = req.body;
    if(!name || !username || !password) throw new ValidationError('Name, Username, Password should not be empty.');
    var query = ` SELECT COUNT(*) FROM APP_USER WHERE USERNAME=$1 `;
    var result = await req.env.pool.query(query, [username]);
    if(result.rows[0].count > 0) throw new ValidationError('Username already exists.');
    query = `
        INSERT INTO APP_USER(ID, NAME, USERNAME, PASSWORD)
        VALUES(NEXTVAL('ID_SEQ_APP_USER'), $1, $2, $3)
        RETURNING ID
    `;
    const saltRounds = 10;
    var hashedPassword = await bcrypt.hash(password, saltRounds);
    result = await req.env.pool.query(query, [name, username, hashedPassword]);
    res.send(result.rows[0]);
};

const getAppUser = async (req, res) => {
    var query = ` SELECT ID, NAME, USERNAME FROM APP_USER WHERE 1=1 `;
    const params = req.query;
    if(params.id){
        query += ` AND ID=${params.id} `;
    }
    var result = await req.env.pool.query(query);
    res.send(result.rows);
};

export default {
    createAppUser,
    getAppUser,
};