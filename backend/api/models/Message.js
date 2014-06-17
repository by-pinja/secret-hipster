'use strict';

/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    schema: true,
    migrate: 'alter',

    attributes: {
        message: {
            type: 'text',
            required: true
        },
        nick: {
            type: 'string',
            required: true
        },
        player: {
            model: 'player'
        }
    }
};

