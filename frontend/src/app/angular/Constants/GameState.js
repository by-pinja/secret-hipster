(function() {
    'use strict';

    /**
     * Constant definitions for different game states, these are used to show game states
     * in readable format in GUI.
     */
    angular.module('HipsterShipster')
        .constant('GameState', {
            1: 'Game waiting players',
            2: 'Round begins',
            3: 'Round end',
            4: 'Game ended'
        });
}());
