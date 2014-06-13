/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var uuid = require('node-uuid');

module.exports = {
	joinLobby: function(req, res) {
        var nick = req.param('nick');

        res.json(200, {nick: nick, token: tokenService.issueToken(uuid.v4())});
    },

    joinGame: function(req, res) {
        var data = {
            foo: 'bar'
        };

        res.json(data);
    },

    PlaceShips: function(req, res) {
        var data = {
            foo: 'bar'
        };

        res.json(data);
    }
};

