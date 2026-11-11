const { sequelize } = require('../config/db');
const Recipe = require('../models/Recipe');
const Strain = require('../models/Strain');
const Discovery = require('../models/Discovery');
const User = require('../models/User');
const { serializeStrain } = require('../lib/catalog');
const { synchronizeProgress } = require('../lib/progression');
exports.getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({ order:[['offspring_id','ASC']], include:[
      {model:Strain,as:'parent1',attributes:['id','name']},
      {model:Strain,as:'parent2',attributes:['id','name']},
      {model:Strain,as:'offspring',attributes:['id','name','generation']},
    ] });
    res.json({success:true,recipes});
  } catch(err) { next(err); }
};
exports.validateRecipe = async (req, res, next) => {
  try {
    const {parent1_id,parent2_id}=req.body;
    if(typeof parent1_id!=='string'||typeof parent2_id!=='string') return res.status(400).json({error:{message:'Two parent strain IDs are required'}});
    const result=await sequelize.transaction(async transaction=>{
      const user=await User.findByPk(req.user.id,{transaction,lock:transaction.LOCK.UPDATE});
      if(!user)return {forbidden:true};
      const progress=await synchronizeProgress(user.id,transaction);
      if(!progress.owned.has(parent1_id)||!progress.owned.has(parent2_id))return {forbidden:true};
      const [a,b]=[parent1_id,parent2_id].sort();
      const candidates=await Recipe.findAll({where:{parent1_id:a,parent2_id:b},include:[{model:Strain,as:'offspring'}],order:[['offspring_id','ASC']],transaction});
      await user.increment('combos_count',{transaction});await user.reload({transaction});
      if(!candidates.length)return {valid:false,combos_count:user.combos_count};
      // Every undiscovered outcome is guaranteed before repeats; no random drop can block a branch.
      const recipe=candidates.find(r=>!progress.owned.has(r.offspring_id))||candidates[0];
      const [,isNew]=await Discovery.findOrCreate({where:{user_id:user.id,strain_id:recipe.offspring_id},transaction});
      const updated=await synchronizeProgress(user.id,transaction);
      return {valid:true,offspring:serializeStrain(recipe.offspring),isNew,combos_count:user.combos_count,
        unlocked:updated.added,remaining_outcomes:candidates.filter(r=>!updated.owned.has(r.offspring_id)).length};
    });
    if(result.forbidden)return res.status(403).json({error:{message:'Discover both parents before combining them'}});
    res.json({success:true,...result});
  } catch(err) {next(err);}
};
