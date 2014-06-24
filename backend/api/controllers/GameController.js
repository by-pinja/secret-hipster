'use strict';

/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var async = require('async');

module.exports = {
    /**
     * Action to join HipsterShipters game lobby
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    joinLobby: function(request, response) {
        var nick = request.param('nick');

        // Oh noe we have no sailor here...
        if (!nick) {
            response.json(400, {message: 'Ohay sailor, you forgot your name? Too much or too little of rum?'});
        } else {
            var socketId = sails.sockets.id(request.socket);

            PlayerService
                .create(nick, socketId, function(error, player) {
                    if (error) {
                        sails.log.error("error occurred at PlayerService.create()");
                        sails.log.error(error);

                        response.json(500, error);
                    } else {
                        var socketData = {
                            verb: 'playerConnectedLobby',
                            data: {
                                message: 'Player \'' + player.player.nick + '\' connected to lobby!',
                                player: player.player
                            }
                        };

                        // Emit socket message that player has connected to lobby
                        sails.sockets.emit(_.remove(sails.sockets.subscribers(), function (socket) {
                            return socket != socketId;
                        }), 'gameMessage', socketData);

                        response.json(200, player);
                    }
                });
        }
    },

    /**
     * Action to fetch active players. Note that this will return all players.
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    getPlayers: function(request, response) {
        PlayerService
            .getPlayers(function(error, players) {
                if (error) {
                    sails.log.error("error occurred at PlayerService.getPlayers()");
                    sails.log.error(error);

                    response.json(500, error);
                } else {
                    response.json(200, players);
                }
            });
    },

    /**
     * Action to join specified game on server. This action requires following parameter(s)
     * on request:
     *
     *  game uuid
     *
     * Output of this action is following:
     *
     *  {
     *      id: {number}
     *      name: {string}
     *      stage: {
     *          id: {number},
     *          name: {string},
     *          maxPlayers: {number},
     *          width: {number},
     *          height: {number}
     *      },
     *      players: {
     *          id: {number},
     *          uuid: {string},
     *          nick: {string}
     *      },
     *      ships: [
     *          {id: {number}, name: {string}, width: {number}}
     *          ...
     *      ]
     *  }
     *
     * @param   {Request}   request     Request object
     * @param   {Response}  response    Response object
     */
    joinGame: function(request, response) {
        var uuid = request.param('uuid');

        async.parallel(
            {
                player: function(callback) {
                    PlayerService.getPlayer(request, callback);
                },
                game: function(callback) {
                    GameService.get({uuid: uuid}, callback);
                },
                ships: function(callback) {
                    ShipService.collection({}, callback);
                }
            },
            function(error, data) {
                if (error) {
                    response.json(500, error);
                } else if (!data.game) {
                    error = new Error();

                    error.message = 'Game not found.';
                    error.status = 404;

                    response.json(404, error);
                } else if (!data.player) {
                    error = new Error();

                    error.message = 'Player not found.';
                    error.status = 404;

                    response.json(404, error);
                } else if (!data.ships) {
                    error = new Error();

                    error.message = 'Ship data not found.';
                    error.status = 404;

                    response.json(404, error);
                } else {
                    var player = _.find(data.game.players, function(player) {
                        return player.id == data.player.id;
                    });

                    // Player not currently in this game
                    if (!player) {
                        data.game.players.add(data.player.id);
                        data.game.save();

                        data.game.players.push(data.player);
                    } else {
                        // Fetch player current state
                    }

                    var socketId = sails.sockets.id(request.socket);
                    var socketData = {
                        verb: 'playerConnectedGame',
                        data: {
                            message: 'Player \'' + data.player.nick + '\' entered game!',
                            player: data.player
                        }
                    };

                    // Emit socket message that player has connected to lobby
                    sails.sockets.emit(_.remove(sails.sockets.subscribers(), function(socket) {
                        return socket != socketId;
                    }), 'gameMessage', socketData);

                    var output = _.merge(data.game, {ships: data.ships});

                    response.json(200, output);
                }
            }
        );
    },

    placeShips: function(request, response) {
        var data = request.param('data');

        async.parallel(
            {
                player: function(callback) {
                    PlayerService.getPlayer(request, callback);
                },
                ships: function(callback) {
                    // Todo add ship placements to database

                    callback(null, data);
                }
            },
            function(error, data) {
                if (error) {
                    sails.log.error("error occurred at GameController.placeShips()");
                    sails.log.error(error);

                    response.json(500, error);
                } else {
                    var socketData = {
                        verb: 'playerReady',
                        data: {
                            message: 'Player \'' + data.player.nick + '\' is ready to ship some bombs!',
                            player: data.player
                        }
                    };

                    // Emit socket message to players that I am ready
                    // Todo send this message only to game players
                    sails.sockets.emit(_.remove(sails.sockets.subscribers(), function (socket) {
                        return socket != sails.sockets.id(request.socket);
                    }), 'gameMessage', socketData);

                    response.json(200, data.ships);
                }
            }
        );
    }
};
