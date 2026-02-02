const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe-platform';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Recipe.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = [
            {
                username: 'ChefMario',
                email: 'mario@example.com',
                password: hashedPassword,
                bio: 'Italian cuisine enthusiast. Pasta is life! 🍝',
                profilePicture: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80',
                followers: [],
                following: []
            },
            {
                username: 'HealthyHannah',
                email: 'hannah@example.com',
                password: hashedPassword,
                bio: 'Plant-based recipes for a glowing life. 🌱',
                profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
                followers: [],
                following: []
            },
            {
                username: 'GrillMaster',
                email: 'grill@example.com',
                password: hashedPassword,
                bio: 'If it can be grilled, I will grill it. 🔥',
                profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
                followers: [],
                following: []
            },
            {
                username: 'BakingBetty',
                email: 'betty@example.com',
                password: hashedPassword,
                bio: 'Sweet treats and sugary eats. 🍰',
                profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                followers: [],
                following: []
            },
            {
                username: 'SpicySam',
                email: 'sam@example.com',
                password: hashedPassword,
                bio: 'Bringing the heat to your kitchen! 🌶️',
                profilePicture: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80',
                followers: [],
                following: []
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Helper to get random user ID
        const randomUser = () => createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
        const randomUsers = (count) => {
            const selected = new Set();
            while (selected.size < count) {
                selected.add(createdUsers[Math.floor(Math.random() * createdUsers.length)]._id);
            }
            return Array.from(selected);
        };

        // Create Recipes
        const recipes = [
            {
                title: 'Authentic Carbonara',
                createdBy: createdUsers[0]._id, // Mario
                description: 'No cream allowed! Just eggs, cheese, guanciale, and pepper. The Roman way.',
                imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
                ingredients: [{ name: 'Spaghetti', quantity: '400g' }, { name: 'Guanciale', quantity: '150g' }, { name: 'Eggs', quantity: '4' }],
                likes: randomUsers(3),
                comments: [
                    { user: createdUsers[1]._id, text: "Looks too heavy for me, but delicious!", date: new Date() },
                    { user: createdUsers[2]._id, text: "Classic!", date: new Date() }
                ]
            },
            {
                title: 'Avocado Toast Deluxe',
                createdBy: createdUsers[1]._id, // Hannah
                description: 'The best way to start the morning. Sourdough, smashed avo, and chili flakes.',
                imageUrl: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800&q=80',
                ingredients: [{ name: 'Avocado', quantity: '1' }, { name: 'Sourdough', quantity: '2 slices' }],
                likes: randomUsers(4),
                comments: []
            },
            {
                title: 'Smoked Brisket',
                createdBy: createdUsers[2]._id, // GrillMaster
                description: '12 hours low and slow. The bark on this is insane.',
                imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80',
                ingredients: [{ name: 'Brisket', quantity: '5kg' }, { name: 'Rub', quantity: '1 cup' }],
                likes: randomUsers(2),
                comments: [{ user: createdUsers[0]._id, text: "Mamma mia! That looks good.", date: new Date() }]
            },
            {
                title: 'Decadent Chocolate Cake',
                createdBy: createdUsers[3]._id, // Betty
                description: 'Rich, moist, and perfect for birthdays.',
                imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
                ingredients: [{ name: 'Flour', quantity: '2 cups' }, { name: 'Cocoa', quantity: '1 cup' }],
                likes: randomUsers(4),
                comments: []
            },
            {
                title: 'Spicy Tacos',
                createdBy: createdUsers[4]._id, // Sam
                description: 'Taco Tuesday is every day if you are brave enough.',
                imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
                ingredients: [{ name: 'Tortillas', quantity: '6' }, { name: 'Beef', quantity: '500g' }],
                likes: randomUsers(1),
                comments: []
            },
            // More fillers
            {
                title: 'Summer Salad',
                createdBy: createdUsers[1]._id,
                description: 'Fresh and light.',
                imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
                ingredients: [],
                likes: randomUsers(2),
                comments: []
            },
            {
                title: 'Homemade Pizza',
                createdBy: createdUsers[0]._id,
                description: 'Better than delivery.',
                imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
                ingredients: [],
                likes: randomUsers(5),
                comments: []
            },
            {
                title: 'Berry Smoothie',
                createdBy: createdUsers[3]._id,
                description: 'Antioxidant boost!',
                imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a90694f3?auto=format&fit=crop&w=800&q=80',
                ingredients: [],
                likes: randomUsers(3),
                comments: []
            }
        ];

        await Recipe.insertMany(recipes);
        console.log(`Created ${recipes.length} recipes`);

        // Connect followers randomly
        for (let user of createdUsers) {
            const others = createdUsers.filter(u => u._id !== user._id);
            const toFollow = others.slice(0, Math.floor(Math.random() * others.length));

            if (toFollow.length > 0) {
                const toFollowIds = toFollow.map(u => u._id);
                await User.findByIdAndUpdate(user._id, { $push: { following: { $each: toFollowIds } } });

                for (let followed of toFollow) {
                    await User.findByIdAndUpdate(followed._id, { $push: { followers: user._id } });
                }
            }
        }
        console.log('Created social connections');

        console.log('Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
