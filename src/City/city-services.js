const CityService={
   
getAllRestaurants(knex){
    return knex
    .select('*')
    .from('restaurants');
},
    getAllRestaurantsInCity(knex, id){
        return knex
        .select('*')
        .from('restaurants')
        .where('city_id', id);
    },
    addRestaurant(knex,newRestaurant){
        return knex
        .insert(newRestaurant)
        .into('restaurants')
        .returning('*')
        .then(rows=>{
            return rows[0];});
    },
    deleteRestaurant(knex, id){
        return knex('restaurants')
        .where('id',id)
        .delete();
    }
};

module.exports = CityService;