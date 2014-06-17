'use strict';

var uuid = require('node-uuid');

/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    schema: true,
    migrate: 'alter',

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        uuid: {
            type: 'string',
            required: true,
            defaultsTo: uuid.v4()
        },
        state: {
            type: 'integer',
            defaultsTo: 1 // 1 = open, 2 = round begins, 3 = round end, 4 = game end
        },
        stage: {
            model: 'stage'
        },
        players: {
            collection: 'player',
            via: 'games',
            dominant: true
        }
    },

    // Lifecycle callbacks

    /**
     * Callback to be run before creating a new game.
     *
     * @param   {Object}    game    The soon-to-be-created Game
     * @param   {Function}  next    Callback function
     */
    beforeCreate: function(game, next) {
        if (!game.hasOwnProperty('uuid')) {
            game.uuid = uuid.v4();
        }

        next(null, game);
    }
};