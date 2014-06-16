(function() {
    'use strict';

    angular.module('HipsterShipster.lobby')
        .controller('lobbyController',
            [
                '$scope', '$timeout', '$sailsSocket', 'Player', 'Players', 'GameService', 'Chat', 'Message',
                function($scope, $timeout, $sailsSocket, Player, Players, GameService, Chat, Message) {
                    var handlers = {};

                    // Lobby message handlers

                    /**
                     * Player connected to lobby,
                     *
                     * @param   {messages.playerConnected}    data
                     */
                    handlers.playerConnected = function(data) {
                        Message.success(data.message);

                        $scope.players.push(data.player);
                    };

                    $scope.player = Player.player();
                    $scope.message = {
                        player: $scope.player.id,
                        nick: $scope.player.nick,
                        message: ''
                    };

                    $scope.players = [];
                    $scope.games = [];

                    // Fetch games from backend
                    GameService
                        .get()
                        .success(function(games) {
                            $scope.games = games;
                        });

                    // Listen lobby messages
                    $sailsSocket
                        .subscribe('game', function(message) {
                            if (handlers[message.verb]) {
                                handlers[message.verb](data);
                            } else {
                                console.log("Implement 'lobbyController' handler for '" + message.verb + "' event.");
                            }
                        });

                    // Load chat messages from server
                    Chat
                        .load()
                        .success(
                            function(messages) {
                                $scope.messages = messages;
                            }
                        );

                    // Fetch current players
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