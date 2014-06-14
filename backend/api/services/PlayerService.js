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
 * @returns {Promise.promise|*}
 */
exports.create = function(nick) {
    var data = {
        nick: nick,
        uuid: uuid.v4()
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
                error ? deferred.rejected(error) : deferred.resolve({player: player, token: token});
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
                error ? deferred.rejected(error) : deferred.resolve(player);
            }
        );

    return deferred.promise;
};
