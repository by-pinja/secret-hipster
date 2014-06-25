(function() {
    'use strict';

    angular.module('HipsterShipster.lobby')
        .controller('lobbyController',
            [
                '$scope', '$timeout', '$state', '$sailsSocket',
                'Player', 'Players', 'GameService', 'GameState', 'Chat', 'Message', 'Listeners',
                function($scope, $timeout, $state, $sailsSocket,
                         Player, Players, GameService, GameState, Chat, Message, Listeners
                ) {
                    var handlers = {};

                    // Lobby message handlers

                    /**
                     * Player connected to lobby,
                     *
                     * @param   {messages.playerConnectedLobby} data
                     */
                    handlers.playerConnectedLobby = function(data) {
                        Message.success(data.message);

                        $scope.players.push(data.player);
                    };

                    $scope.selectedGame = '';
                    $scope.gameState = GameState;
                    $scope.player = Player.player();
                    $scope.message = {
                        player: $scope.player.id,
                        nick: $scope.player.nick,
                        message: ''
                    };

                    $scope.players = [];
                    $scope.games = [];

                    $scope.selectGame = function(game) {
                        if ($scope.selectedGame === game.uuid) {
                            $scope.selectedGame = '';
                        } else {
                            $scope.selectedGame = game.uuid;
                        }
                    };

                    $scope.enterGame = function() {
                        $state.go('game.game', {game: $scope.selectedGame});
                    };

                    // Listener not yet registered
                    if (!Listeners.lobbyController) {
                        // Listen lobby messages
                        $sailsSocket
                            .subscribe('gameMessage', function(message) {
                                if (handlers[message.verb]) {
                                    handlers[message.verb](message.data);
                                } else {
                                    console.log('Implement \'lobbyController\' handler for \'' + message.verb + '\' event.');
                                }
                            });

                        Listeners.lobbyController = true;
                    }

                    // Fetch games from backend
                    GameService
                        .collection()
                        .success(
                            function(games) {
                                $scope.games = games;
                            }
                        );

                    // Load chat messages from server
                    Chat
                        .load()
                        .success(
                            function(messages) {
                                $scope.messages = messages;
                            }
                        );

                    // Fetch current players
                    // todo: add this to route resolve
                    $timeout(function() {
                        Players
                            .get()
                            .success(
                                function(players) {
                                    $scope.players = players;
                                }
                            );
                        }, 500);

                    // Function to post a new message
                    $scope.postMessage = function() {
                        if ($scope.message.message !== '') {
                            Chat
                                .send($scope.message)
                                .success(
                                    function() {
                                        $scope.message.message = '';
                                    }
                                );
                        }
                    };
                }
            ]
        );
}());