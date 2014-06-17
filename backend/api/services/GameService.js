'use strict';
/**
 * Game service which contains all necessary methods to fetch game related data.
 *
 * Note that all services should have following methods:
 *
 *  get(where, next, [noExistsCheck])   =>  Fetches single game object from database
 *  collection(where, next)             =>  Fetches collection of game objects from database
 *
 * @todo    Add collection method
 */

/**
 * Getter method for single game object. Note that method will populate following
 * game relations automatic:
 *
 *  - stage
 *  - players
 *
 * @param   {{}}        where           Query conditions
 * @param   {Function}  next            Callback function which is called after fetch
 * @param   {Boolean}   [noExistsCheck] If true, don't send error if record not found
 */
exports.get = function(where, next, noExistsCheck) {
    noExistsCheck = noExistsCheck || false;

    Game
        .findOne(where)
        .populate('stage')
        .populate('players')
        .exec(function(error, /** sails.model.game */ game) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to fetch game data]');
                sails.log.error(error);
            } else if (!game && !noExistsCheck) {
                error = new Error();

                error.message = 'Game not found.';
                error.status = 404;
            }

            next(error, game);
        });
};