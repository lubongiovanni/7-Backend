const knex = require('knex');

class ProductsContainer {
    constructor(options, db) {
        this.options = options;
        this.db = db;
    };

    async dropTable() {
        try {
            await knex(this.options).schema.dropTable(this.db);
            console.log(this.db, 'table dropped!');

        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async createTable() {
        try {
            await knex(this.options).schema.createTable(this.db, table => {
                table.increments('id').primary(),
                table.string('title', 50).notNullable(),
                table.integer('price').notNullable(),
                table.string('thumbnail', 200).notNullable()
            });
            console.log(this.db, 'table created!');

        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async save(product) {
        try {
            await knex(this.options)(this.db).insert(product);
            knex(this.options).destroy();
            console.log('product inserted!');

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

    async getById(id) {
        try {
            const content = await knex(this.options).from(this.db).select("title", "price", "thumbnail").where("id", "=", id);
            knex(this.options).destroy();
            return content;
            
        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async deleteAll() {
        try {
            await knex(this.options).from(this.db).del();
            knex(this.options).destroy();
            console.log('all items deleted!');
            
        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    async deleteById(id) {
        try {
            await knex(this.options).from(this.db).where('id', '=', id).del();
            knex(this.options).destroy();
            console.log('item deleted!');
            
        } catch (error) {
            console.log(error);
            throw error;
        };
    };
};

module.exports = ProductsContainer;