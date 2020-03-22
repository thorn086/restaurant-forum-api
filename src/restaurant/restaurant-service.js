const RestService={
   
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
    getRestaurantById(knex, id){
        return knex
        .select('*')
        .from('restaurants')
        .where('id', id);
    },
 
    deleteRestaurant(knex, id){
        return knex('restaurants')
        .where('id',id)
        .delete();
    },
    updateRestaurant(knex, id, updatedRestaurant){
        return knex('restaurants')
        .where({id})
        .update(updatedRestaurant);
    }
};

module.exports = RestService;