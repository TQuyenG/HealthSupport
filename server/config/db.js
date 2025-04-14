const { Sequelize } = require('sequelize');
const path = require('path');
const config = require(path.resolve(__dirname, 'config'));

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Kết nối MySQL thành công'))
  .catch((err) => {
    console.error('Lỗi kết nối MySQL:', err.message);
    process.exit(1);
  });

module.exports = sequelize;