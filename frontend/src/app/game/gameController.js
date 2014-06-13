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
                        $scope.shipMapData = [];
                });


                $scope.shipSelected = function(ship) {
                    $scope.selectedShip = ship;

                }

                $scope.placeShip = function(row, col) {
                    if (!$scope.selectedShip) return;
                    $scope.gameData.Ships.forEach(function(value, index){
                       if(value.id === $scope.selectedShip.id){
                           $scope.gameData.Ships.splice(index,1);
                           return;
                       }
                    });
                    $scope.selectedShip = null;

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