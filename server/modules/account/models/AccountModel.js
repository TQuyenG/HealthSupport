// healthcare-support-project/server/modules/account/models/AccountModel.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { len: [10, 11] },
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('patient', 'doctor', 'staff', 'admin'),
    defaultValue: 'patient',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'inactive',
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'd1.jpg',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  hooks: {
    afterCreate: async (user) => {
      const roleData = {
        user_id: user.id,
        username: user.username,
        email: user.email,
      };
      switch (user.role) {
        case 'patient': await sequelize.models.Patient.create(roleData); break;
        case 'doctor': await sequelize.models.Doctor.create(roleData); break;
        case 'staff': await sequelize.models.Staff.create(roleData); break;
        case 'admin': await sequelize.models.Admin.create(roleData); break;
        default: console.log(`Unknown role: ${user.role}`);
      }
    },
  },
});

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: User, key: 'id' } },
  username: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  medical_history: { type: DataTypes.TEXT, allowNull: true },
  blood_type: { type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), allowNull: true },
});

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: User, key: 'id' } },
  username: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  specialty: { type: DataTypes.STRING, allowNull: true },
  license_number: { type: DataTypes.STRING, allowNull: true, unique: true },
});

const Staff = sequelize.define('Staff', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: User, key: 'id' } },
  username: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  position: { type: DataTypes.ENUM('receptionist', 'accountant', 'nurse'), allowNull: true },
  shift: { type: DataTypes.ENUM('morning', 'afternoon', 'night'), allowNull: true },
  position_description: { type: DataTypes.TEXT, allowNull: true }, // Thêm cột mô tả
});

const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: User, key: 'id' } },
  username: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  department: { type: DataTypes.STRING, allowNull: true },
});

const Permission = sequelize.define('Permission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING, allowNull: true },
  module: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general' }, // Thêm cột module
});

const RolePermission = sequelize.define('RolePermission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.ENUM('patient', 'doctor', 'staff', 'admin'), allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Permission, key: 'id' } },
});

// Quan hệ
User.hasOne(Patient, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Doctor, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Staff, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Admin, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Admin.belongsTo(User, { foreignKey: 'user_id' });
Permission.hasMany(RolePermission, { foreignKey: 'permission_id' });
RolePermission.belongsTo(Permission, { foreignKey: 'permission_id' });

module.exports = { User, Patient, Doctor, Staff, Admin, Permission, RolePermission };