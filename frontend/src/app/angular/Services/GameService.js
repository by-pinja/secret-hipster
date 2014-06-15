(function() {
    'use strict';

    angular.module('frontend.services')
        .factory('GameService',
            [
                '$sailsSocket', '$timeout', 'BackendConfig',
                function($sailsSocket, $timeout, BackendConfig) {
                    var games = [];
                    var handlers = {};

                    // Subscribe to games and attach 'created' event to 'message' room
                    $sailsSocket
                        .subscribe('game', function(data) {
                            handlers[data.verb](data);
                        });

                    // Add handler for 'created' event
                    handlers.created = function(message) {
                        games.push(message.data);
                    };

                    // Todo: add delete and update handlers

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