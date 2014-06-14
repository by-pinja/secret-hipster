/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {
    joinLobby: function(req, res) {
        var nick = req.param('nick');

        // Oh noe we have no sailor here...
        if (!nick) {
            res.json(400, {message: 'Ohay sailor, you forgot your name? Too much or too little of rum?'});
        } else {
            PlayerService
                .create(nick)
                .then(
                    function(data) {
                        res.json(200, {player: data.player, token: data.token});
                    },
                    function(error) {
                        console.log("error occurred at PlayerService.create()");
                        console.log(error);
                    }
                );
        }
    },

    joinGame: function(req, res) {
        // Todo fetch this from database...
        var data = {
            Name: 'Awesome game',
            Players: [
                {
                    nick: 'foo',
                    points: 0,
                    state: 0
                },
                {
                    nick: 'bar',
                    points: 0,
                    state: 0
                }
            ],
            Stage: {
                width: 10,
                height: 10
            },
            Ships: [
                {
                    id: 1,
                    name: 'Ruotsin laiva',
                    width: 4
                },
                {
                    id: 2,
                    name: 'Jolla',
                    width: 1
                }
            ]
        };

        res.json(data);
    },

    placeShips: function(req, res) {
        var data = {
            foo: 'bar',
            bar: 'foo'
        };

        // Todo add ship placements to database

        // Fetch current request user nick data and broadcast it to another clients.
        PlayerService
            .getPlayer(req)
            .then(
                function(player) {
                    var socketData = {
                        verb: 'playerReady',
                        data: {
                            message: 'player \'' + player.nick + '\' is ready to ship some bombs!',
                            player: player
                        }
                    };

                    // Emit socket message to users
                    sails.sockets.emit(_.remove(sails.sockets.subscribers(), function(socket) {
                        return socket != sails.sockets.id(req.socket);
                    }), 'game', socketData);
                },
                function(error) {
                    console.log("error occurred at PlayerService.getPlayer(req)");
                    console.log(error);
                }
            );

        res.json(data);
    }
};

