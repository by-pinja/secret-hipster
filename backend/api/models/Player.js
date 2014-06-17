'use strict';

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
    schema: true,
    migrate: 'alter',

    attributes: {
        nick: {
            type:'string',
            required: true
        },
        uuid: {
            type:'string',
            required: true
        },
        socketId: {
            type:'string',
            required: true
        },
        games: {
            collection: 'game',
            via: 'players'
        }
    }
};