/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	joinLobby: function(req, res) {
        var data = {
            nick: req.param('nick')
        };

        res.json(data);
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

