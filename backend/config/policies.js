'use strict';

/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */
module.exports.policies = {
    // Default policy for all controllers and actions
    '*': ['passport', 'authenticated'],

    // AuthController is allowed to all
    AuthController: {
        '*': ['passport']
    },
    GameController: {
        'joinLobby': ['passport'] // Just this action is allowed to all
    }
};
