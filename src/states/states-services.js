const StatesService={
    getAllStates(knex){
        return knex
        .select('*')
        .from('states');
    },

    getAllCitiesInState(knex, id){
        return knex
        .select('*')
        .from('city')
        .where('state_id', id);
    },
    addCity(knex,newCity){
        return knex
        .insert(newCity)
        .into('city')
        .returning('*')
        .then(rows=>{
            return rows[0];});
    },
    deleteCity(knex, id){
        return knex('city')
        .where('id',id)
        .delete();
    }
};

module.exports = StatesService;