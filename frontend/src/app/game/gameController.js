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

                $scope.shipsReady = function() {
                    var shipData = {
                       ships: [
                           {
                               id: 1,
                               x: 2,
                               y: 2
                           },
                           {
                               id: 2,
                               x: 2,
                               y: 2
                           }
                       ]
                    };

                    $sailsSocket
                        .subscribe('Game', function(message) {
                            console.log('got message');
                            console.log(message);
                        });


                    $sailsSocket
                        .post(BackendConfig.url+ '/game/placeShips', shipData)
                        .success(function(response) {
                            console.log(response);


                        });
                }
            }
        ]
    );

    angular.module('frontend.game')
        .filter('range', function() {
        return function(input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i=min; i<max; i++)
                input.push(i);
            return input;
        };
    });
}());