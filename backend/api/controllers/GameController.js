/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var async = require('async');

module.exports = {
    getPlayers: function(req, res) {
        PlayerService
            .getPlayers()
            .then(
                function(players) {
                    res.json(200, players);
                },
                function(error) {
                    console.log("error occurred at PlayerService.getPlayers()");
                    console.log(error);

                    res.json(500, error);
                }
            )
    },

    joinLobby: function(req, res) {
        var nick = req.param('nick');

        // Oh noe we have no sailor here...
        if (!nick) {
            res.json(400, {message: 'Ohay sailor, you forgot your name? Too much or too little of rum?'});
        } else {
            var socketId = sails.sockets.id(req.socket);

            PlayerService
                .create(nick, socketId)
                .then(
                    function(data) {
                        var socketData = {
                            verb: 'playerConnectedLobby',
                            data: {
                                message: 'Player \'' + data.player.nick + '\' connected to lobby!',
                                player: data.player
                            }
                        };

                        // Emit socket message that player has connected to lobby
                        sails.sockets.emit(_.remove(sails.sockets.subscribers(), function(socket) {
                            return socket != socketId;
                        }), 'gameMessage', socketData);

                        res.json(200, {player: data.player, token: data.token});
                    },
                    function(error) {
                        console.log("error occurred at PlayerService.create()");
                        console.log(error);

                        res.json(500, error);
                    }
                );
        }
    },

    joinGame: function(req, res) {
        var uuid = req.param('uuid');

        async.parallel(
            {
                player: function(callback) {
                    PlayerService
                        .getPlayer(req)
                        .then(
                            function(player) {
                                callback(null, player);
                            },
                            function(error) {
                                callback(error, null);
                            }
                        );
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
                    res.json(500, error);
                } else if (!data.game) {
                    error = new Error();

                    error.message = 'Game not found.';
                    error.status = 404;

                    res.json(404, error);
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

                    var socketId = sails.sockets.id(req.socket);
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

                    res.json(200, output);
                }
            }
        );
    },

    placeShips: function(req, res) {
        var data = req.param('data');

        // Todo add ship placements to database

        // Fetch current request user nick data and broadcast it to another clients.
        PlayerService
            .getPlayer(req)
            .then(
                function(player) {
                    var socketData = {
                        verb: 'playerReady',
                        data: {
                            message: 'Player \'' + player.nick + '\' is ready to ship some bombs!',
                            player: player
                        }
                    };

                    // Emit socket message to players that I am ready
                    sails.sockets.emit(_.remove(sails.sockets.subscribers(), function(socket) {
                        return socket != sails.sockets.id(req.socket);
                    }), 'gameMessage', socketData);
                },
                function(error) {
                    console.log("error occurred at PlayerService.getPlayer(req)");
                    console.log(error);
                }
            );

        res.json(data);
    }
};

