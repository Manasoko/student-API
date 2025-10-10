import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { Sequelize } from 'sequelize';



export interface TestDatabase {
  container: StartedMySqlContainer;
  sequelize: Sequelize;
}

export const setupTestDatabase = async (): Promise<TestDatabase> => {
  console.log('Starting MySQL container...');
  
  const container = await new MySqlContainer('mysql:8.0')
    .withDatabase('testdb')
    .withUsername('root')
    .withRootPassword('Manasoko@1')
    .withReuse()
    .start();

  console.log('MySQL container started');

  const sequelize = new Sequelize({
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getUserPassword(),
    database: container.getDatabase(),
  });

  // Test connection
  await sequelize.authenticate();

  // Sync database (create tables)
  await sequelize.sync({ force: true });

  console.log('Test database ready');

  return { container, sequelize };
};

export const teardownTestDatabase = async (testDb: TestDatabase) => {
  try {
    if (testDb.sequelize) {
      await testDb.sequelize.close();
      console.log('Database connection closed');
    }
    if (testDb.container) {
      await testDb.container.stop();
      console.log('Container stopped');
    }
  } catch (error) {
    console.error('Error during teardown:', error);
  }
};

export const clearDatabase = async (sequelize: Sequelize) => {
  await sequelize.sync({ force: true });
};
