(function() {
    'use strict';

    angular.module('HipsterShipster.services')
        .factory('GameService',
            [
                '$sailsSocket', '$timeout', 'BackendConfig',
                function($sailsSocket, $timeout, BackendConfig) {
                    var games = [];
                    var handlers = {};

                    // Add handler for 'created' event
                    handlers.created = function(message) {
                        games.push(message.data);
                    };

                    // Todo: add delete and update handlers

                    // Subscribe to games and attach 'created' event to 'message' room
                    $sailsSocket
                        .subscribe('game', function(data) {
                            if (handlers[data.verb]) {
                                handlers[data.verb](data);
                            } else {
                                console.log("Implement 'GameService' handler for '" + data.verb + "' event.");
                            }
                        });

                    // Load games from server
                    function getGames() {
                        return $sailsSocket
                            .get(BackendConfig.url + '/game')
                            .success(
                                function(response) {
                                    games = response;

                                    return response;
                                }
                            );
                    }

                    // Create a new message
                    function createGame(data) {
                        return $sailsSocket
                            .post(BackendConfig.url + '/game', data)
                            .success(
                                function(response) {
                                    games.push(response);

                                    return response;
                                }
                            );
                    }

                    // Todo: add update and delete
                    return {
                        get: getGames,
                        create: createGame
                    };
                }
            ]
        );
}());