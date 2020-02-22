const StatesService={
    getAllStates(knex){
        return knex
        .select('*')
        .from('states')
    },

    getCitiesId(knex, id){
        return knex('city')
        .select('*')
        .where('stateId',id)
        .first()
    }
}

module.exports = StatesService