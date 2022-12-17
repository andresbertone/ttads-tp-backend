const { DataTypes } = require('sequelize');
const sequelize = require('../database/db-connection');
const Customer = require('./customer');

const Shift = sequelize.define('shift', {
    shiftId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    shiftDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    shiftCancellationDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.ENUM('Stand by', 'Entered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Stand by'
    },
    customerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Customer,
            key: 'customerId'
        }
    }
}, 
{
    sequelize,
    tableName: 'shift',
    timestamps: false,
    indexes: [
        {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
                { name: "shiftId" }
            ]
        },
        {
            name: "fk_shift_customer_idx",
            using: "BTREE",
            fields: [
                { name: "customerId" }
            ]
        }
    ]
});

module.exports = Shift;