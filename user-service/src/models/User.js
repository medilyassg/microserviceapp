const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); // For hashing passwords
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'patient'),
    allowNull: false,
    defaultValue: 'patient',
  },
});

const createDefaultUser = async () => {
  try {
    // Check if any users exist in the database
    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('password', 10); // Replace with a secure password
      await User.create({
        name: 'Super Admin',
        email: 'admin@example.com', // Replace with a default admin email
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Default admin user created successfully.');
    }
  } catch (error) {
    console.error('Error creating default user:', error.message);
  }
};

// Sync the database and create the default user
sequelize
  .sync({ force: false }) // Use `force: true` only during development to reset tables
  .then(() => {
    console.log('Database synced successfully.');
    createDefaultUser();
  })
  .catch((error) => {
    console.error('Error syncing database:', error.message);
  });

module.exports = User;
