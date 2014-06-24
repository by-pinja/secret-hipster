'use strict';

var uuid = require('node-uuid');

/**
 * Service method to create new player to HipsterShipters. In successfully cases this will
 * return following object:
 *
 *  {
 *      player: {player data},
 *      token: {authentication token}
 *  }
 *
 * Note that token is only used to authenticate request from frontend to backend side. And
 * this token is _private_ so please don't expose it to other clients!
 *
 * @param   {string}    nick        Player nickname
 * @param   {string}    socketId    Current socket id of player
 * @param   {function}  next        Callback function
 */
exports.create = function(nick, socketId, next) {
    var data = {
        nick: nick,
        uuid: uuid.v4(),
        socketId: socketId
    };

    /**
     * Issue JWT token, note that there is possible bug with this library because plain uuid crashes it...
     * This means that we cannot use plain v4 uuid as payload, fuck this shit.
     */
    var token = tokenService.issueToken({uuid: data.uuid});

    // Create new player
    Player
        .create(data)
        .exec(function(error, player) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to create player]');
                sails.log.error(error);

                next(error, null);
            } else {
                next(null, {player: player, token: token});
            }
        });
};

/**
 * Service method to get current player via request.token value.
 *
 * @param   {Request}   request Request object
 * @param   {function}  next    Callback function
 */
exports.getPlayer = function(request, next) {
    Player
        .findOne({uuid: request.token.uuid})
        .exec(function(error, player) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to fetch player data]');
                sails.log.error(error);
            }

            next(error, player);
        });
};

/**
 * Service method to update current player socket id data. This update is done every
 * reload of page. This is needed because socket id is changed when user reloads page.
 * With this we can be sure which players are online and which are not.
 *
 * @param   {token}     token   Token object
 * @param   {Request}   request Request object
 */
exports.updateSocketId = function(token, request) {
    if (request.isSocket) {
        Player
            .update({uuid: token.uuid}, {socketId: sails.sockets.id(request.socket)})
            .exec(function(error, updated) {
                if (error) {
                    sails.log.error('Cannot update player socket id data');
                    sails.log.error(error);
                } else {
                    // Nothing to do here
                }
            });

    } else {
        sails.log.info('not socket request');
    }
};

/**
 * Service method to fetch currently active players. Activity is based on currently
 * opened and listen sockets.
 *
 * @param   {function}  next    Callback function
 */
exports.getPlayers = function(next) {
    var socketIds = _.map(sails.sockets.subscribers(), function(socket) {
        return {socketId: socket};
    });

    Player
        .find({or: socketIds})
        .exec(function(error, players) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to fetch players]');
                sails.log.error(error);
            }

            next(error, players);
        });
};

/**
 * Method to fetch specified game players from database.
 *
 * @param   {string}    uuid    Game UUID
 * @param   {function}  next    Callback function
 */
exports.getGamePlayers = function(uuid, next) {
    Game
        .findOne({uuid: uuid})
        .populate('players')
        .exec(function(error, game) {
            if (error) {
                sails.log.error(__filename + ':' + __line + ' [Failed to fetch game players]');
                sails.log.error(error);

                next(error, null);
            } else if (!game) {
                error = new Error();

                error.message = 'Game not found.';
                error.status = 404;
            } else {
                next(null, game.players);
            }
        });
};

