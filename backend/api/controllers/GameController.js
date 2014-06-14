/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');
var _ = require('lodash');

module.exports = {
    joinLobby: function(req, res) {
        var nick = req.param('nick');

        // Oh noe we have no sailor here...
        if (!nick) {
            res.json(400, {message: 'Ohay sailor, you forgot your name? Too much or too little of rum?'});
        } else {
            // Create user data which is saved to database
            var data = {
                nick: nick,
                uuid: uuid.v4()
            };

            /**
             * Issue JWT token, note that there is possible bug with this library because plain uuid crashes it...
             * This means that we cannot use plain v4 uuid as payload, fuck this shit.
             */
            var token = tokenService.issueToken({uuid: data.uuid});

            // Create new nick
            Nick
                .create(data)
                .exec(
                    function(err, user) {
                        if (err) {
                            res.json(500, err);
                        } else {
                            res.json(200, {user: user, token: token});
                        }
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

        // Todo which 'room' to join socket?
        sails.sockets.join(req, 'game');

        res.json(data);
    },

    placeShips: function(req, res) {
        var data = {
            foo: 'bar',
            bar: 'foo'
        };

        // Todo add ship placements to database

        // Fetch current request user nick data and broadcast it to another clients.
        Nick
            .findOne({uuid: req.token.uuid})
            .exec(function(err, nick) {
                if (err) {
                    // Todo what do we do?
                } else {
                    var socketData = {
                        verb: 'playerReady',
                        data: 'player \'' + nick.nick + '\' is ready to ship some bombs!'
                    };

                    sails.sockets.emit(_.remove(sails.sockets.subscribers(), function(socket) {
                        return socket != sails.sockets.id(req.socket);
                    }), 'game', socketData);
                }
            });

        res.json(data);
    }
};

