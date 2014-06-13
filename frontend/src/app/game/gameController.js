(function() {
    'use strict';

    angular.module('frontend.game')
        .controller('gameController',
        [
            '$scope', '$sailsSocket',  'BackendConfig',
            function($scope, $sailsSocket, BackendConfig) {
                // Game socket message handlers
                var handlers = {};
                var emptyPosition = {char : '~~~', ship: null};

                $sailsSocket
                    .get(BackendConfig.url+ '/game/joinGame').success(function(message) {
                        $scope.gameData = message;

                        $scope.shipMapData = new Array();

                        for (var row=0; row < $scope.gameData.Stage.height; row++) {
                            $scope.shipMapData[row] = new Array();
                            for (var col=0; col < $scope.gameData.Stage.width; col++) {
                                $scope.shipMapData[row][col] = emptyPosition;
                            }
                        }

                });


                $scope.shipSelected = function(ship) {
                    $scope.selectedShip = ship;

                };

                $scope.placeShip = function(row, col) {
                    var clickShip =$scope.shipMapData[row][col].ship;

                    if (!$scope.selectedShip && clickShip) {
                        $scope.gameData.Ships.push(clickShip);
                        for (var i=0; i < $scope.gameData.Stage.height; i++) {
                            for (var j=0; j < $scope.gameData.Stage.width; j++) {
                                if($scope.shipMapData[i][j].ship == clickShip) {
                                    $scope.shipMapData[i][j] = emptyPosition;
                                }
                            }
                        }
                        return;
                    }


                    if(col+$scope.selectedShip.width > $scope.gameData.Stage.width) {
                        return;
                    }

                    for(var i=0; i < $scope.selectedShip.width; i++) {
                        if($scope.shipMapData[row][col+i].ship) {
                            return;
                        }
                    }

                    for(var i=0; i < $scope.selectedShip.width; i++) {
                        $scope.shipMapData[row][col+i] = {char : '***', ship : $scope.selectedShip};
                    }

                    $scope.gameData.Ships.forEach(function(value, index){
                       if(value.id === $scope.selectedShip.id){
                           $scope.gameData.Ships.splice(index,1);
                           return;
                       }
                    });



                    $scope.selectedShip = null;

                };


                // Listen game messages
                $sailsSocket
                    .subscribe('game', function(message) {
                        handlers[message.verb](message.data);
                    });

                // Game message handlers
                /**
                 * @param data  Player
                 */
                handlers.playerReady = function (data) {
                    console.log('Player ready', data);
                };

                /**
                 * @param data  Bombs and time
                 */
                handlers.roundBegin = function (data) {
                    console.log('Round beging', data);
                };

                /**
                 * @param data  Players and shots
                 */
                handlers.roundEnd = function (data) {
                    console.log('Round end', data);
                };

                /**
                 * @param data  Players
                 */
                handlers.gameEnd = function (data) {
                    console.log('Game end', data);
                };
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