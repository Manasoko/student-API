import { Sequelize } from 'sequelize';

type Config = {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
}

const createSequelizeInstance = (config?: Config) => {
    if (config) {
        // Test environment with custom config
        return new Sequelize({
            dialect: 'mysql',
            host: config.host || 'localhost',
            port: config.port || 3306,
            database: config.database || 'test',
            username: config.username || 'root',
            password: config.password || '',
            logging: false,
        });
    }

    // Default environment (development/production)
    return new Sequelize(
        process.env.DATABASE_NAME || '',
        process.env.DATABASE_USER || 'root',
        process.env.DATABASE_PASSWORD,
        { dialect: 'mysql', host: 'mysql' }
    );
};

const sequelize = createSequelizeInstance();

export default sequelize;
export { createSequelizeInstance };