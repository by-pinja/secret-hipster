(function() {
    'use strict';

    angular.module('frontend.services')
        .factory('Chat',
            [
                '$sailsSocket', '$timeout', 'BackendConfig',
                function($sailsSocket, $timeout, BackendConfig) {
                    var messages = [];
                    var handlers = {};

                    // Subscribe to messages and attach 'created' event to 'message' room
                    $sailsSocket
                        .subscribe('message', function(message) {
                            handlers[message.verb](message);
                        });

                    // Add handler for 'created' event
                    handlers.created = function(message) {
                        messages.push(message.data);
                    };

                    // Load messages from server
                    function loadMessages() {
                        return $sailsSocket
                            .get(BackendConfig.url + '/message')
                            .success(
                                function(response) {
                                    messages = response;

                                    return response;
                                }
                            );
                    }

                    // Create a new message
                    function sendMessage(message) {
                        return $sailsSocket
                            .post(BackendConfig.url + '/message', message)
                            .success(
                                function(response) {
                                    messages.push(response);

                                    return response;
                                }
                            );
                    }

                    return {
                        load: loadMessages,
                        send: sendMessage
                    };
                }
            ]
        );
}());
