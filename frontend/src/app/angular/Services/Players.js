(function() {
    'use strict';

    angular.module('frontend.services')
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