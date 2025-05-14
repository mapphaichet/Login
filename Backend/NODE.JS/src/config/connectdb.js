import { Sequelize } from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: 'BIN',
  user: 'HUY',
  password: 'null',
  host: 'localhost',
  logging: false,
  port: 3306,
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