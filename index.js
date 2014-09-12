var request = require('request');



/**
 * Push service helper class.
 * @constructor
 */
var PushServiceHelper = function() {
    this.apiRoot = null;
    this.appName = null;
};


/**
 * Configures this helper.
 * @param {string} apiRoot Must be valid url. No "/" at the end.
 *                         Ex: "http://push-service.example.com"
 * @param {string} appName Application name which is registered to push service server.
 */
PushServiceHelper.prototype.configure = function(apiRoot, appName) {
    this.apiRoot = apiRoot;
    this.appName = appName;
};


/**
 * Request method. Automaticly adds api root and X-App-Name header to requests.
 * @param {{url: string, method: string, json: Object}} data Request data. Api root is automaticly 
 *                                                           added to url. So url format must be like "/users/10".
 * @param {Function=} opt_callback Optional callback.
 * @private
 */
PushServiceHelper.prototype.request_ = function(data, opt_callback) {
    var options = {
            url: this.apiRoot + (data.url || '/'),
            method: data.method || 'GET',
            headers: {
                'X-App-Name': this.appName
            }
        };

    if (data.json)
        options.json = data.json;

    request(options, function(err, response, body) {
        // "err" is not working, check status code manually.
        var isError = (!response) ||(response.statusCode < 200) || (response.statusCode >= 300);

        if (!!response && response.statusCode == 401)
            console.log('Push service authentication error: Please check you application name and whether this ' +
                'server\'s IP adress is added to application whitelist ip addresses.');

        opt_callback && opt_callback(isError, body);
    });
};


/**
 * Creates a user if user is not existing on db. If the user exists on the db, it updates the locale property 
 * and adds the new device. Note that all the previous devives for that specific user remains unchanged.
 * @param {string} userId Unique user id.
 * @param {{locale: string, device: Object}} userData User data. Sample userData:
 *                                                    { locale: 'tr', device: { type: 'ios', token: 'XXX' } }
 * @param {Function=} opt_callback Optional callback.
 */
PushServiceHelper.prototype.upsertUser = function(userId, userData, opt_callback) {
    this.request_({
        url: '/user/' + (userId ? userId : ''),
        method: (userId ? 'PUT' : 'POST'),
        json: userData
    }, opt_callback);
};


/**
 * Deletes the user and all it's devices from the db.
 * @param {string} userId
 * @param {Function=} opt_callback
 */
PushServiceHelper.prototype.deleteUser = function(userId, opt_callback) {
    this.request_({
        url: '/user/' + userId,
        method: 'DELETE'
    }, opt_callback);
};


/**
 * Deletes a specific device from the user.
 * @param {string} userId
 * @param {string} deviceToken
 * @param {Function=} opt_callback
 */
PushServiceHelper.prototype.deleteDeviceFromUser = function(userId, deviceToken, opt_callback) {
    this.request_({
        url: '/user/' + userId + '/device',
        method: 'DELETE',
        json: {
            token: deviceToken
        }
    }, opt_callback);
};


/**
 * Sends push notification to multiple users or just single user..
 * @param {Array|string} userIds An array which contains user ids. Or you can pass string if you're sending
 *                               to single person.
 * @param {Object|string} message An object that contains message in different languages, or you can pass
 *                                just string if user locale is not important.
 *                                Ex: { en: "Message", tr: "Mesaj" }
 *                                Ex: "Message"
 * @param {Function=} opt_callback Optional callback.
 */
PushServiceHelper.prototype.send = function(userIds, message, opt_callback) {
    this.request_({
        url: '/message',
        method: 'POST',
        json: {
            message: message,
            userIds: userIds
        }
    }, opt_callback);
};


/**
 * Sends push notification to every user in your app.
 * @param {Object|string} message An object that contains message in different languages, or you can pass
 *                                just string if user locale is not important.
 *                                Ex: { en: "Message", tr: "Mesaj" }
 *                                Ex: "Message"
 * @param {Function=} opt_callback Optional callback.
 */
PushServiceHelper.prototype.sendAll = function(message, opt_callback) {
    this.request_({
        url: '/message',
        method: 'POST',
        json: {
            message: message
        }
    }, opt_callback);
};


module.exports = new PushServiceHelper();
