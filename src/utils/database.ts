import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DATABASE_NAME || '',
    process.env.DATABASE_USER || 'root',
    process.env.DATABASE_PASSWORD,
    {dialect: 'mysql', host: 'localhost'}
);

export default sequelize;