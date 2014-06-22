# Backend for 'HipsterShipster' application

Backend is a [Sails](http://sailsjs.org) application without frontend. Basically this only serves an API and
player authentication services - nothing else.

## API description
Every API endpoints are accessible via socket and REST queries. Basically endpoint urls are in following
structure:
```
http://YourBackend:Port/Controller/Action
```
### Game
This is main controller which players will use on this application. This controller has following endpoints:
#### getPlayers
[x] Requires JWT token
[x] Allowed methods: GET, POST
[x] No parameters
This will return all connected players as in array of player objects in JSON format. JSON data is following:
```json
{
    nick: "some nick",
    uuid: "uuid v4"
}
```

todo add API description...

## Installation instructions
First of all you need following applications installed on your box
* node.js, http://nodejs.org/
* Sails.js, http://sailsjs.org/
* Bower, https://github.com/bower/bower
* MySQL, http://www.mysql.com/

After that you can install 'HipsterShipster' backend simply by just running command:
<pre>
npm install
</pre>

### Configuration
Sails.js applications uses ```local.js``` configuration file to overwrite any existing configuration value and
add your own config values if you need those. First of all you must make your own configuration file, and this
can be done by following command:
<pre>
cd config
cp local_example.js local.js
</pre>

After that you can open that ```local.js``` with your favorite editor and make necessary changes to if match
your own environment.

### Running
Sails.js server is started via following command:
<pre>
sails lift
</pre>

After successfully server start you should see some sails lifted...

## Authors
See at Protacon Solutions organization [members](https://github.com/orgs/ProtaconSolutions/members) and repository
[contributors](https://github.com/ProtaconSolutions/secret-hipster/graphs/contributors).

## License
The MIT License (MIT)

Copyright (c) 2014 Protacon Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.