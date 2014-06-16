'use strict';

/**
 * Stage.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    schema: true,

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        maxPlayers: {
            type: 'integer',
            defaultsTo: 2,
            required: true
        },
        width: {
            type: 'integer',
            defaultsTo: 10,
            required: true
        },
        height: {
            type: 'integer',
            defaultsTo: 10,
            required: true
        }
    }
};

