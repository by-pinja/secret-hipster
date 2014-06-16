(function() {
    'use strict';

    angular.module('HipsterShipster.game')
        .controller('gameController',
        [
            '$scope', '$sailsSocket',  'BackendConfig',
            function($scope, $sailsSocket, BackendConfig) {
                // Game socket message handlers
                var handlers = {};
                var emptyPosition = {char : '', ship: null};
                $scope.placeDirection = 'horizontal';

                $sailsSocket
                    .get(BackendConfig.url+ '/game/joinGame').success(function(message) {
                        $scope.gameData = message;
                        $scope.selectedShip = $scope.gameData.Ships[0];
                        $scope.shipMapData = new Array();

                        for (var row=0; row < $scope.gameData.Stage.height; row++) {
                            $scope.shipMapData[row] = new Array();
                            for (var col=0; col < $scope.gameData.Stage.width; col++) {
                                $scope.shipMapData[row][col] = emptyPosition;
                            }
                        }
                });

                $scope.readyToPlay = function() {
                    $sailsSocket
                        .post(BackendConfig.url+ '/game/placeShips', {some: 'data'})
                        .success(function(response) {
                            console.log("Yeah i'm ready to deliver bombs! now just wait others...");
                            console.log(response);
                        });
                };

                $scope.shipSelected = function(ship) {
                    if ($scope.selectedShip === ship) {
                        $scope.selectedShip = null;
                    } else {
                        $scope.selectedShip = ship;
                    }
                };

                $scope.placeShip = function(row, col) {
                    var clickShip =$scope.shipMapData[row][col].ship;

                    if (clickShip) {
                        $scope.gameData.Ships.push(clickShip);
                        for (var i=0; i < $scope.gameData.Stage.height; i++) {
                            for (var j=0; j < $scope.gameData.Stage.width; j++) {
                                if($scope.shipMapData[i][j].ship == clickShip) {
                                    $scope.shipMapData[i][j] = emptyPosition;
                                }
                            }
                        }
                        $scope.selectedShip = clickShip;
                        return;
                    }

                    if (!$scope.selectedShip && !clickShip) {
                        return;
                    }


                    if ($scope.placeDirection === 'horizontal') {
                        if (col + $scope.selectedShip.width > $scope.gameData.Stage.width) {
                            return;
                        }


                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            if ($scope.shipMapData[row][col + i].ship) {
                                return;
                            }
                        }
                    } else {
                        if (row + $scope.selectedShip.width > $scope.gameData.Stage.height) {
                            return;
                        }


                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            if ($scope.shipMapData[row+i][col].ship) {
                                return;
                            }
                        }
                    }

                    if ($scope.placeDirection === 'horizontal') {
                        for(var i=0; i < $scope.selectedShip.width; i++) {
                            $scope.shipMapData[row][col+i] = {char : '', ship : $scope.selectedShip};
                        }
                    } else {
                        for(var i=0; i < $scope.selectedShip.width; i++) {
                            $scope.shipMapData[row+i][col] = {char : '', ship : $scope.selectedShip};
                        }
                    }

                    $scope.gameData.Ships.forEach(function(value, index){
                       if(value.id === $scope.selectedShip.id){
                           $scope.gameData.Ships.splice(index,1);
                           return;
                       }
                    });

                    if( $scope.gameData.Ships.length === 0 ) {
                        $scope.selectedShip = null;
                        return;
                    }
                    $scope.selectedShip = $scope.gameData.Ships[0];
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
                    console.log('Player ready');
                    console.log(data);
                };

                /**
                 * @param data  Bombs and time
                 */
                handlers.roundBegin = function (data) {
                    console.log('Round beging');
                    console.log(data);
                };

                /**
                 * @param data  Players and shots
                 */
                handlers.roundEnd = function (data) {
                    console.log('Round end');
                    console.log(data);
                };

                /**
                 * @param data  Players
                 */
                handlers.gameEnd = function (data) {
                    console.log('Game end');
                    console.log(data);
                };
            }
        ]
    );

    angular.module('HipsterShipster.game')
        .filter('range', function() {
            return function(input, min, max) {
                min = parseInt(min); // Make string input int
                max = parseInt(max);

                for (var i = min; i < max; i++) {
                    input.push(i);
                }

                return input;
            };
        });
}());