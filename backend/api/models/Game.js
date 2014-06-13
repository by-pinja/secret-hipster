/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        title: {
            type: 'string',
            required: true
        },
        players: {
            collection: 'player',
            via: 'player'
        },
        stage: {
            model: 'stage'
        },
        state: {
            type: 'integer', // 1 = pregame, 2 = round begin, 3 = round end, 4 = end game.
            defaultsTo: 1
        }
    }
};

