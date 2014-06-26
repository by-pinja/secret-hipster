(function() {
    'use strict';

    /**
     * Generic game service factory for HipsterShipster game application. This service contains
     * following methods that you can use in where ever you inject this service.
     *
     *  GameService.get(parameters)
     *  GameService.collection(parameters)
     *  GameService.join(parameters)
     *  GameService.create(data)
     *
     * Also note that this service will automatic subscribe client to listen 'game' socket stream
     * messages.
     *
     * @todo    Add better information about method parameters
     * @todo    Add support for .get(123)
     */
    angular.module('HipsterShipster.services')
        .factory('GameService',
            [
                '$sailsSocket', '$timeout', 'BackendConfig',
                function($sailsSocket, $timeout, BackendConfig) {
                    var games = [];

                    // Subscribe to 'game' socket stream
                    $sailsSocket
                        .subscribe('game', function(data) {
                            if (handlers[data.verb]) {
                                handlers[data.verb](data);
                            } else {
                                console.log('Implement \'GameService\' handler for \'' + data.verb + '\' event.');
                            }
                        });

                    var handlers = {};

                    // Handler for 'created' event
                    handlers.created = function(message) {
                        games.push(message.data);
                    };

                    // Handler for 'updated' event
                    handlers.updated = function(message) {
                        handlers['removed'](message);

                        games.push(message.data);
                    };

                    // Handler for 'removed' event
                    handlers.removed = function(message) {
                        _.remove(games, function(game) {
                            return game.id === message.id;
                        });
                    };

                    // Fetch specified game from server
                    function get(parameters) {
                        parameters = {params: parameters || {}};

                        return $sailsSocket
                            .get(BackendConfig.url + '/game', parameters)
                            .success(
                                function(response) {
                                    return response[0];
                                }
                            );
                    }

                    // Load games from server
                    function collection(parameters) {
                        parameters = {params: parameters || {}};

                        return $sailsSocket
                            .get(BackendConfig.url + '/game', parameters)
                            .success(
                                function(response) {
                                    games = response;

                                    return response;
                                }
                            );
                    }

                    // Create a new message
                    function create(data) {
                        return $sailsSocket
                            .post(BackendConfig.url + '/game', data)
                            .success(
                                function(response) {
                                    games.push(response);

                                    return response;
                                }
                            );
                    }

                    // Join game
                    function join(parameters) {
                        parameters = parameters || {};

                        return $sailsSocket
                            .post(BackendConfig.url + '/game/joinGame/', parameters)
                            .success(
                                function(response) {
                                    return response;
                                }
                            );
                    }

                    // Leave game
                    function leave(parameters) {
                        parameters = parameters || {};

                        return $sailsSocket
                            .post(BackendConfig.url + '/game/leaveGame/', parameters)
                            .success(
                                function(response) {
                                    return response;
                                }
                            );
                    }

                    // Todo: add update and delete
                    return {
                        get: get,
                        join: join,
                        leave: leave,
                        collection: collection,
                        create: create
                    };
                }
            ]
        );
}());