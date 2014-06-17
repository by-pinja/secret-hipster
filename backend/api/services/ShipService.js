'use strict';
/**
 * Generic ship service which contains all necessary methods to fetch ship related data.
 *
 * Note that all services should have following methods:
 *
 *  get(where, next, [noExistsCheck])   =>  Fetches single object from database
 *  collection(where, next)             =>  Fetches collection of objects from database
 *
 * @todo    Add get() method
 */

/**
 * Method to fetch collection of ships from database. Note that these ships are just generic
 * ships from database, so these doesn't contain any game specified information.
 *
 * @param   {{}}        where   Query conditions
 * @param   {Function}  next    Callback function
 */
exports.collection = function(where, next) {
    Ship
        .find()
        .where(where)
        .sort('width DESC')
        .exec(function(error, /** sails.model.ship[] */ ships) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to fetch ship data]');
                sails.log.error(error);
            }

            next(error, ships);
        });
};
