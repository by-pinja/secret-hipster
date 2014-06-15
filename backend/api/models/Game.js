'use strict';

module.exports = {
    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        state: {
            type: 'integer',
            defaultsTo: 1 // 1 = open, 2 = round begins, 3 = round end, 4 = game end
        },
        players: {
            collection: 'player',
            via: 'games',
            dominant: true
        }
    }
};