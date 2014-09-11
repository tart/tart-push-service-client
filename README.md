# Tart Push Service Client


Tart Push Service Client is a helper class which interacts easily with [Tart Push Service](https://github.com/tart/push-service).


## Installation

* Run `npm install tart-push-service-client --save` in your current project.
* Require this class in your `app.js` and configure it.

```
var pushService = require('tart-push-service-client');
pushService.configure('http://PUSH_SERVICE_SERVER', 'appName');
```

## Methods
*Note: This helper class must be configured before using any of these methods listed below.*
#### upsertUser(userId, userData[, callback])
Creates a user if user is not existing on db. If the user exists on the db, it updates the locale property and adds the new device. Note that all the previous devices for that specific user remains unchanged. 

`userId` must be a unique string for your each user, preferably you can use same userId of your database. `userData` must be an object that contains `locale` and `device` properties. A sample usage is given as follows:
```
pushService.upsertUser('123456789', {
    locale: 'en',
    device: {
        type: 'android',
        token: 'APA91bGj8Ap6L...mxXCFt0ko8OCJC'
    }
});
```


#### deleteUser(userId[, callback])
Deletes the user and all it's devices from the db. Sample usage:
```
pushService.deleteUser('123456');   

```

#### deleteDeviceFromUser(userId, deviceToken[, callback])
Deletes a specific device from the user. Sample usage:
```
pushService.deleteDeviceFromUser('123456789', 'APA91bGj8Ap6L...mxXCFt0ko8OCJC');
```

#### send(userIds, message[, callback])
Sends push notifications. `userIds` must be an array of user ids to recieve this push notification. Or you can just pass string if you're sending to single person. `message` must be an object that contains your text in different languages. Or you can just pass string if you want to ignore user locale. 

The following example will send notification to 2 specific person:
```
pushService.send(['123456', '987654'], {
    en: 'Message',
    tr: 'Mesaj'
});
```

If you want to send to a single user, you can use like this:
```
pushService.send('987654', 'Message');
```


#### sendAll(message[, callback])
Sends push notifications to all users in app. `message` can be object or string as same usage that described above.
```
pushService.sendAll({
    en: 'Message',
    tr: 'Mesaj'
});
```
