/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');

module.exports = {
	joinLobby: function(req, res) {
        var data = {
            nick: req.param('nick'),
            token: uuid.v4()
        };



        // Create new nick
        Nick
            .create(data)
            .exec(
                function(err, data) {
                    if (err) {
                        res.json(401, err);
                    } else {
                        res.json(200, data);
                    }
                }
            );
    },

    joinGame: function(req, res) {
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

        console.log(req.isSocket);

        // todo which game to join socket?
        console.log(sails.sockets.join(req, 'game'));

        res.json(data);
    },

    placeShips: function(req, res) {
        var data = {
            foo: 'bar',
            token: req.token,
            bar: 'foo'
        };

        console.log('jee asetin laivat');

        sails.sockets.broadcast('game', 'placeShips', data, req.socket);


        var roomNames = JSON.stringify(sails.sockets.socketRooms(req.socket));

        console.log(roomNames);

        res.json(data);
    }
};

