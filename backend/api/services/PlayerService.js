'use strict';

var uuid = require('node-uuid');
var q = require('q');

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
 * @param   {string}    nick
 * @param   {string}    socketId
 *
 * @returns {Promise.promise|*}
 */
exports.create = function(nick, socketId) {
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

    var deferred = q.defer();

    // Create new player
    Player
        .create(data)
        .exec(
            function(error, player) {
                error ? deferred.reject(error) : deferred.resolve({player: player, token: token});
            }
        );

    return deferred.promise;
};

/**
 * Service method to get current player via request.token value.
 *
 * @param   {Request}   req
 *
 * @returns {Promise.promise|*}
 */
exports.getPlayer = function(req) {
    var deferred = q.defer();

    Player
        .findOne({uuid: req.token.uuid})
        .exec(
            function(error, player) {
                error ? deferred.reject(error) : deferred.resolve(player);
            }
        );

    return deferred.promise;
};

/**
 * Service method to update current player socket id data. This update is done every
 * reload of page. This is needed because socket id is changed when user reloads page.
 * With this we can be sure which players are online and which are not.
 *
 * @param   {token}     token
 * @param   {Request}   request
 */
exports.updateSocketId = function(token, request) {
    if (request.isSocket) {
        Player
            .update({uuid: token.uuid}, {socketId: sails.sockets.id(request.socket)})
            .exec(function(err, updated) {
                if (err) {
                    sails.log.error('Cannot update player socket id data');
                    sails.log.error(err);
                } else {
                    // Nothing to do here
                }
            });

    } else {
        sails.log.info('not socket request');
    }
};

/**
 * Service method to fetch currently active users. Activity is based on currently
 * opened and listen sockets.
 *
 * @returns {Promise.promise|*}
 */
exports.getPlayers = function() {
    var deferred = q.defer();

    var socketIds = _.map(sails.sockets.subscribers(), function(socket) {
        return {socketId: socket};
    });

    Player
        .find({or: socketIds})
        .exec(
            function(error, players) {
                error ? deferred.reject(error) : deferred.resolve(players);
            }
        );

    return deferred.promise;
};

