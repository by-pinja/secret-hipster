(function() {
    'use strict';

    angular.module('HipsterShipster.services')
        .factory('Players',
            [
                '$sailsSocket', 'BackendConfig',
                function($sailsSocket, BackendConfig) {
                    return {
                        get: function() {
                            return $sailsSocket.get(BackendConfig.url + '/game/getPlayers');
                        }
                    };
                }
            ]
        );
}());