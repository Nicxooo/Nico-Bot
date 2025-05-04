const Sequelize = require('sequelize');
const sequelize = require('../utility/database');

const Guild = sequelize.define('guild', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    welcomeChannelId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    welcomeRoleId: {
        type: Sequelize.STRING,
        allowNull: true
    },
    welcomeBackground: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rankBackground: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports = Guild;