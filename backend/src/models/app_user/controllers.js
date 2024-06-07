import bcrypt from 'bcrypt';
import ValidationError from '../../errors/validationError.js';

const saltRounds = 10;
const getAppUser = async (req, res) => {
    var query = ` SELECT ID, NAME, USERNAME FROM APP_USER `;
    var result = await req.env.pool.query(query);
    res.send(result.rows);
};

const getAppUserByID = async (req, res) => {
    var query = ` SELECT ID, NAME, USERNAME FROM APP_USER WHERE ID=${req.params.id} `;
    var result = await req.env.pool.query(query);
    res.send(result.rows);
};

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
    var hashedPassword = await bcrypt.hash(password, saltRounds);
    result = await req.env.pool.query(query, [name, username, hashedPassword]);
    res.send(result.rows[0]);
};

const updateAppUser = async (req, res) => {
    var cols = req.body;
    var query = [` UPDATE APP_USER SET `];
    var setStatement = [];
    var paramsIndex = 1;
    var params = [];
    for(var key in cols){
        if(key === 'password'){
            cols[key] = await bcrypt.hash(cols[key], saltRounds);
        }
        setStatement.push(` ${key}=$${paramsIndex} `);
        params.push(cols[key]);
        paramsIndex += 1;
    }
    query.push(setStatement.join(', '));
    query.push(` WHERE ID=$${paramsIndex} `);
    params.push(parseInt(req.params.id));
    await req.env.pool.query(query.join(' '), params);
    res.send({status: 'success'});
};

const deleteUser = async (req, res) => {
    var result = await req.env.pool.query(` SELECT IS_ADMIN FROM APP_USER WHERE ID=${req.params.id} `);
    await req.env.pool.query(` DELETE FROM APP_USER WHERE ID=$1 `, [req.params.id]);
    res.send({status: 'success'});
};

export default {
    getAppUser,
    getAppUserByID,
    createAppUser,
    updateAppUser,
    deleteUser,
};