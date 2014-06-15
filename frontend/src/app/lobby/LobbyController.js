(function() {
    'use strict';

    angular.module('frontend.controllers')
        .controller('lobbyController',
            [
                '$scope', '$timeout', '$sailsSocket', 'Player', 'Players', 'Chat', 'Message',
                function($scope, $timeout, $sailsSocket, Player, Players, Chat, Message) {
                    var handlers = {};

                    $scope.player = Player.player();
                    $scope.message = {
                        player: $scope.player.id,
                        nick: $scope.player.nick,
                        message: ''
                    };

                    $scope.players = [];

                    // Listen lobby messages
                    $sailsSocket
                        .subscribe('game', function(message) {
                            handlers[message.verb](message.data);
                        });

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