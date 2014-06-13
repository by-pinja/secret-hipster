(function() {
    'use strict';

    angular.module('frontend.game')
        .controller('gameController',
        [
            '$scope', '$sailsSocket',  'BackendConfig',
            function($scope, $sailsSocket, BackendConfig) {

                $sailsSocket
                    .get(BackendConfig.url+ '/game/joinGame').success(function(message) {
                        $scope.gameData = message;
                });
            }
        ]
    );

    angular.module('frontend.game')
        .filter('range', function() {
        return function(input, min, max) {
            console.log('dsd');
            console.log(input);
            console.log(min);
            console.log(max);

            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i=min; i<max; i++)
                input.push(i);
            return input;
        };
    });
}());