
const { sequelize } = require('../config/db');
const User = require('../models/User');
const Strain = require('../models/Strain');
const Recipe = require('../models/Recipe');
const Discovery = require('../models/Discovery');

// Sample STRAINS data (replace with full dataset from the repository)
const seedStrains = [
  {
    id: 'afghani',
    name: 'Afghani',
    type: 'Indica',
    generation: 0,
    thc: 18.00,
    cbd: 0.50,
    flavor: ['Earthy', 'Hashy'],
    effects: ['Relaxed', 'Sleepy'],
    description: 'A pure indica landrace from Afghanistan.',
    image_url: 'assets/afghani.png'
  },
  {
    id: 'colombian-gold',
    name: 'Colombian Gold',
    type: 'Sativa',
    generation: 0,
    thc: 15.00,
    cbd: 0.80,
    flavor: ['Citrus', 'Sweet'],
    effects: ['Euphoric', 'Energizing'],
    description: 'A pure sativa landrace from Colombia.',
    image_url: 'assets/colombian-gold.png'
  },
  {
    id: 'durban-poison',
    name: 'Durban Poison',
    type: 'Sativa',
    generation: 0,
    thc: 16.00,
    cbd: 0.30,
    flavor: ['Sweet', 'Earthy'],
    effects: ['Happy', 'Creative'],
    description: 'A pure sativa landrace from South Africa.',
    image_url: 'assets/durban-poison.png'
  },
  {
    id: 'thai',
    name: 'Thai',
    type: 'Sativa',
    generation: 0,
    thc: 17.00,
    cbd: 0.60,
    flavor: ['Spicy', 'Herbal'],
    effects: ['Uplifting', 'Focused'],
    description: 'A pure sativa landrace from Thailand.',
    image_url: 'assets/thai.png'
  },
  {
    id: 'skunk-1',
    name: 'Skunk #1',
    type: 'Hybrid',
    generation: 1,
    thc: 16.00,
    cbd: 1.00,
    flavor: ['Sweet', 'Skunky'],
    effects: ['Euphoric', 'Happy'],
    description: 'A classic hybrid created from Afghani and Colombian Gold.'
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    type: 'Indica',
    generation: 1,
    thc: 18.00,
    cbd: 0.50,
    flavor: ['Earthy', 'Sweet'],
    effects: ['Relaxed', 'Sleepy'],
    description: 'A potent indica hybrid with Afghani and Thai lineage.'
  },
  {
    id: 'haze',
    name: 'Haze',
    type: 'Sativa',
    generation: 1,
    thc: 19.00,
    cbd: 0.40,
    flavor: ['Citrus', 'Earthy'],
    effects: ['Euphoric', 'Energizing'],
    description: 'A sativa-dominant hybrid with Colombian Gold and Thai lineage.'
  }
];

// Sample RECIPE_INDEX data (replace with full dataset from the repository)
const seedRecipes = [
  { parent1_id: 'afghani', parent2_id: 'colombian-gold', offspring_id: 'skunk-1' },
  { parent1_id: 'afghani', parent2_id: 'thai', offspring_id: 'northern-lights' },
  { parent1_id: 'colombian-gold', parent2_id: 'thai', offspring_id: 'haze' }
];

const seed = async () => {
  try {
    // Sync models with the database
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    // Seed strains
    const existingStrains = await Strain.count();
    if (existingStrains === 0) {
      await Strain.bulkCreate(seedStrains);
      console.log('Strains seeded successfully.');
    } else {
      console.log('Strains already exist. Skipping.');
    }

    // Seed recipes
    const existingRecipes = await Recipe.count();
    if (existingRecipes === 0) {
      await Recipe.bulkCreate(seedRecipes);
      console.log('Recipes seeded successfully.');
    } else {
      console.log('Recipes already exist. Skipping.');
    }

    // Seed guest user
    const existingGuest = await User.findOne({ where: { username: 'guest' } });
    if (!existingGuest) {
      const guestUser = await User.create({
        username: 'guest',
        is_guest: true,
      });
      
      // Auto-discover Gen 0 strains for guest
      const landraceStrains = seedStrains.filter((s) => s.generation === 0);
      await Discovery.bulkCreate(
        landraceStrains.map((strain) => ({
          user_id: guestUser.id,
          strain_id: strain.id,
        }))
      );
      console.log('Guest user and discoveries seeded successfully.');
    } else {
      console.log('Guest user already exists. Skipping.');
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
