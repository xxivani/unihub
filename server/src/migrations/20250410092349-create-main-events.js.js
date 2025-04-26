'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('AllEvents', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            time: {
                type: Sequelize.STRING,
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            followed: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            waiting: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            clubId: {
                type: Sequelize.BIGINT,
                allowNull: true,
                references: {
                    model: 'clubs',
                    key: 'club_id'
                }
            },
            status: {
                type: Sequelize.ENUM('ONGOING', 'COMPLETED'),
                allowNull: false,
            },
            budget_required: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: 0
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: true
            },
            image: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            team: {
                type: Sequelize.JSONB,
                allowNull: true,
                defaultValue: []
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });

    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('AllEvents');
    }
};