const knex = require('knex');
const moment = require('moment');

class MessagesContainer {
    constructor(options, db) {
        this.options = options;
        this.db = db;
    };

    async dropTable() {
        try {
            await knex(this.options).schema.dropTableIfExists(this.db);
            console.log(this.db, 'table dropped!');

        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async createTable() {
        try {
            if(await knex(this.options).schema.hasTable(this.db) == false) {
                await knex(this.options).schema.createTable(this.db, table => {
                    table.increments('id').primary(),
                    table.string('user', 50).notNullable(),
                    table.string('date'),
                    table.integer('message')
            });
                console.log(this.db, 'table created!');
            };

        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async save(user, date, message) {
        try {
            await knex(this.options)(this.db).insert({user, date, message});
            knex(this.options).destroy();
            console.log('Message inserted!');

        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async getAll() {
        try {
            const content = await knex(this.options).from(this.db).select("*");
            knex(this.options).destroy();
            return content;
            
        } catch (error) {
            console.log(error);
            throw error;
        };
    };
};

module.exports = MessagesContainer;