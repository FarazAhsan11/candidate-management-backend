import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();
connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany({});
        console.log('Existing users cleared');

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'Test User',
                email: 'user@example.com',
                password: 'user123',
                role: 'user'
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'john123',
                role: 'user'
            },
            {
                name: 'Ahmad Ali',
                email: 'ahmad@example.com',
                password: 'ahmad123',
                role: 'hr'
            },
            {
                name: 'Sara Khan',
                email: 'sara@example.com',
                password: 'sara123',
                role: 'interviewer'
            }
        ];

        for (const userData of users) {
            await User.create(userData);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
