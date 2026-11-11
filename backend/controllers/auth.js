const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { sequelize } = require('../config/db');
const { jwtConfig } = require('../config/jwt');
const User = require('../models/User');
const Discovery = require('../models/Discovery');
const Strain = require('../models/Strain');
const { synchronizeProgress } = require('../lib/progression');
const safeUser = u => ({ id: u.id, username: u.username, email: u.email, is_guest: u.is_guest, combos_count: u.combos_count });
const respond = (res, user) => res.json({ success: true, user: safeUser(user), token: jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn }) });
async function createUser(values) {
  return sequelize.transaction(async transaction => {
    const user = await User.create(values, { transaction });
    await synchronizeProgress(user.id, transaction);
    return user;
  });
}
exports.signup = async (req, res, next) => {
  try {
    const { password, email = '' } = req.body;
    const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    if (!/^[a-z0-9_-]{2,40}$/.test(username) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72 || typeof email !== 'string' || email.length > 254) {
      return res.status(400).json({ error: { message: 'Use a 2–40 character username (letters, numbers, _ or -) and a password of 8–72 bytes.' } });
    }
    const user = await createUser({ username, email: email || null, password_hash: await bcrypt.hash(password, 10), is_guest: false });
    respond(res, user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: { message: 'Username already exists' } });
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const password = req.body.password;
    if (typeof password !== 'string') return res.status(400).json({ error: { message: 'Username and password are required' } });
    const user = await User.findOne({ where: { username, is_guest: false } });
    if (!user || !await bcrypt.compare(password, user.password_hash)) return res.status(401).json({ error: { message: 'Invalid username or password' } });
    respond(res, user);
  } catch (err) { next(err); }
};
exports.guestLogin = async (req, res, next) => {
  try {
    const user = await createUser({ username: `guest_${randomUUID()}`, password_hash: '', is_guest: true });
    respond(res, user);
  } catch (err) { next(err); }
};
exports.logout = (req, res) => res.json({ success: true });
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(401).json({ error: { message: 'Session no longer exists' } });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) { next(err); }
};
