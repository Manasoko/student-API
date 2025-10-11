import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { Sequelize } from 'sequelize';
import { createSequelizeInstance } from '../../src/utils/database.js';

let container: StartedMySqlContainer | null = null;
let testSequelize: Sequelize | null = null;

export const setupTestDatabase = async () => {
    if (container && testSequelize) {
        // Reuse existing container
        return testSequelize;
    }

    console.log('Starting MySQL container...');
    
    container = await new MySqlContainer('mysql:8.0')
        .withDatabase('student_db')
        .withUsername('test_user')
        .withUserPassword('test_password')
        .withRootPassword(process.env.DATABASE_PASSWORD || 'root_password')
        .withReuse() // Enable container reuse
        .start();

    console.log(`MySQL container started on port ${container.getPort()}`);

    // Create test Sequelize instance
    testSequelize = createSequelizeInstance({
        host: container.getHost(),
        port: container.getPort(),
        database: container.getDatabase(),
        username: container.getUsername(),
        password: container.getUserPassword(),
    });

    // Test connection
    await testSequelize.authenticate();
    console.log('Connected to test database');

    // Sync models (create tables)
    await testSequelize.sync({ force: true });
    console.log('Database synced');

    return testSequelize;
};

export const teardownTestDatabase = async () => {
    try {
        if (testSequelize) {
            // Close all connections
            await testSequelize.close();
            console.log('Database connection closed');
            testSequelize = null;
        }
    } catch (error) {
        console.error('Error closing database:', error);
    }

    try {
        if (container) {
            await container.stop({ timeout: 10000 });
            console.log('MySQL container stopped');
            container = null;
        }
    } catch (error) {
        console.error('Error stopping container:', error);
    }
};

export const clearDatabase = async () => {
    if (testSequelize) {
        try {
            await testSequelize.sync({ force: true });
            console.log('Database cleared');
        } catch (error) {
            console.error('Error clearing database:', error);
        }
    }
};

export const getTestSequelize = () => {
    if (!testSequelize) {
        throw new Error('Test database not initialized. Call setupTestDatabase first.');
    }
    return testSequelize;
};