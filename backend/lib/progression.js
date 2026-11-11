const Discovery = require('../models/Discovery');
const { grantAccessions, crossCount } = require('./catalog');
async function synchronizeProgress(userId, transaction) {
  const rows = await Discovery.findAll({ where: { user_id: userId }, attributes: ['strain_id'], transaction });
  const owned = new Set(rows.map(d=>d.strain_id));
  const added = grantAccessions(owned);
  if (added.length) await Discovery.bulkCreate(added.map(strain_id=>({user_id:userId,strain_id})), { ignoreDuplicates: true, transaction });
  return { owned, added, crossCount: crossCount(owned) };
}
module.exports = { synchronizeProgress };
