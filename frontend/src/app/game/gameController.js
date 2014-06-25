(function() {
    'use strict';

    /**
     * Main game controller of HipsterShipster game. This contains most of the actual
     * game logic and other stuff related to actual game.
     *
     * todo refactor shipMapData creation and handling, seems to be "fuzzy", maybe some lo-dash?
     * todo add missing logic to gameMessage socket stream handling
     */
    angular.module('HipsterShipster.game')
        .controller('gameController',
        [
            '$scope', '$sailsSocket',
            'BackendConfig', 'Message', 'Listeners', '_',
            'gameData',
            function($scope, $sailsSocket,
                     BackendConfig, Message, Listeners, _,
                     gameData
            ) {
                var emptyPosition = {char : '', ship: null};

                $scope.placeDirection = 'horizontal';
                $scope.gameData = gameData.data;
                $scope.selectedShip = $scope.gameData.ships[0];
                $scope.shipMapData = [];

                for (var row = 0; row < $scope.gameData.stage.height; row++) {
                    $scope.shipMapData[row] = [];

                    for (var col = 0; col < $scope.gameData.stage.width; col++) {
                        $scope.shipMapData[row][col] = emptyPosition;
                    }
                }

                $scope.readyToPlay = function() {
                    $sailsSocket
                        .post(BackendConfig.url + '/game/placeShips', {data: $scope.shipMapData})
                        .success(
                            function(response) {
                                console.log("Yeah i'm ready to deliver bombs! now just wait others...");
                                console.log(response);
                            }
                        );
                };

                $scope.shipSelected = function(ship) {
                    $scope.selectedShip = ($scope.selectedShip === ship) ? null : ship;
                };

                $scope.placeShip = function(row, col) {
                    var clickShip = $scope.shipMapData[row][col].ship;

                    if (clickShip) {
                        $scope.gameData.ships.push(clickShip);

                        for (var i = 0; i < $scope.gameData.stage.height; i++) {
                            for (var j = 0; j < $scope.gameData.stage.width; j++) {
                                if ($scope.shipMapData[i][j].ship == clickShip) {
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
                        if (col + $scope.selectedShip.width > $scope.gameData.stage.width) {
                            return;
                        }

                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            if ($scope.shipMapData[row][col + i].ship) {
                                return;
                            }
                        }
                    } else {
                        if (row + $scope.selectedShip.width > $scope.gameData.stage.height) {
                            return;
                        }

                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            if ($scope.shipMapData[row + i][col].ship) {
                                return;
                            }
                        }
                    }

                    if ($scope.placeDirection === 'horizontal') {
                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            $scope.shipMapData[row][col + i] = {char : '', ship : $scope.selectedShip};
                        }
                    } else {
                        for (var i = 0; i < $scope.selectedShip.width; i++) {
                            $scope.shipMapData[row + i][col] = {char : '', ship : $scope.selectedShip};
                        }
                    }

                    $scope.gameData.ships.forEach(function(value, index){
                       if (value.id === $scope.selectedShip.id){
                           $scope.gameData.ships.splice(index, 1);
                       }
                    });

                    if ($scope.gameData.ships.length === 0) {
                        $scope.selectedShip = null;
                    }

                    $scope.selectedShip = $scope.gameData.ships[0];
                };

                // Game socket message handlers
                var handlers = {};

                // Game message handlers

                handlers.playerConnectedGame = function(data) {
                    var player = _.find($scope.gameData.players, function(player) {
                        return player.id == data.player.id;
                    });

                    // We have a new player on our hand!
                    if (!player) {
                        Message.success(data.message);
                    }
                };

                /**
                 * @param   {message.playerReady}   data
                 */
                handlers.playerReady = function (data) {
                    Message.success(data.message);

                    console.log('Player ready');
                    console.log(data);
                };

                /**
                 * @param   {message.roundBegin}    data
                 */
                handlers.roundBegin = function (data) {
                    console.log('Round beging');
                    console.log(data);
                };

                /**
                 * @param   {message.roundEnd}      data
                 */
                handlers.roundEnd = function (data) {
                    console.log('Round end');
                    console.log(data);
                };

                /**
                 * @param   {message.gameEnd}       data
                 */
                handlers.gameEnd = function (data) {
                    console.log('Game end');
                    console.log(data);
                };

                // Listener not yet registered
                if (!Listeners.gameController) {
                    // Listen game messages
                    $sailsSocket
                        .subscribe('gameMessage', function(message) {
                            if (handlers[message.verb]) {
                                handlers[message.verb](message.data);
                            } else {
                                console.log("Implement 'gameController' handler for '" + message.verb + "' event.");
                            }
                        });

                    Listeners.gameController = true;
                }
            }
        ]
    );

    /**
     * todo Remove this and use angular-lodash module for this.
     */
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