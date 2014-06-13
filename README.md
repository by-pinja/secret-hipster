-> Join
-Name:string

<- JoinReply
-Token:string

-> JoinGame

<- JoinGameReply
-Name:string
-Players:collection
-Stage:stage
-Ships:collection

-> PlaceShips
-Ships:collection

<- PlayerReady
-Player
*name
*points
*state


<- RoundBegin
-Bombs
*x
*y
*type
-Time


-> RoundAction
-Bombs

<- RoundEnd
-Players
-Shots
*x
*y
*hit

<- GameEnd
-Players
