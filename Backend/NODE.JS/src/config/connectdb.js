import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: 'BIN',
  user: 'root',
  password: 'null',
  host: 'localhost',
  logging: false,
  port: 8080,
});
let connectDB = async() => {
    try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}
export default connectDB;