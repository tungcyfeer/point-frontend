// popinfo.js

/**
 * class for make magic global function.
 **/

function NativeCallback() {
    if (!NativeCallback.prototype.instance){
        NativeCallback.prototype.instance = this;
    }
    this.magicName = 'NativeCallback_' + NativeCallback.prototype.makeId();
    return NativeCallback.prototype.instance;
};

/**
 * make random string
 * @return String random string.
 **/
NativeCallback.prototype.makeId = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

/**
 * register callback function.
 * @param function callback
 * @return String callback function name.
 **/
NativeCallback.prototype.register = function(callback){
    var receiver = 'callback_' + NativeCallback.prototype.makeId();
    this[receiver] = callback;
    return (new NativeCallback()).magicName + '.' + receiver;
}

// make global function with magicName.
window[(new NativeCallback()).magicName] = new NativeCallback();

/**
 * class for communicate native.
 **/
function Popinfo() {
    if (!Popinfo.prototype.instance){
        Popinfo.prototype.instance = this;
        this.events = {};
    }
    return Popinfo.prototype.instance;
};

/**
 * register handler for event.
 * @param String event , function callback
 * @return nothing
 */
Popinfo.prototype.on = function(event, callback){
    this.events[event] = callback;
};

/**
 * dispatch event.
 * @param String event , any param
 * @return nothing
 */
Popinfo.prototype.dispatch = function(event, param){
    this.events[event](param);
}

/**
 * Get a value of URL querystring.
 * @param {string} key
 * @return {string} value or null.
 */ 
Popinfo.prototype.getQuery = function(key){
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

/**
 * call native method via url.
 * @param {string} url
 * @return nothing
 */ 
Popinfo.prototype.callUrl = function(url){
    window.location.replace(url);
}

/**
 * Construct URL.
 * @param {string} path
 * @return {string} url
 */ 
Popinfo.prototype.constructUrl = function(path, callbackName){
    return 'native://' + path + '?callback=' + callbackName;
}

/**
 * Call native function then call callback.
 * @param {string} path
 * @return {string} 
 */ 
Popinfo.prototype.callNative = function(path, callback){
    var callbackName = (new NativeCallback()).register(callback);
    var url = this.constructUrl(path, callbackName);
    try{
        return this.callUrl(url);
    }catch(e){
        return undefined;
    }
};

/**
 * Get 'some' from querystring or native path then call callback.
 * @return nothing
 */ 
Popinfo.prototype.getValue = function(key, path, callback){
    console.log(callback);
    var v = this.getQuery(key);
    if (v){
        setTimeout(function(){callback(v)}, 100);
    }else{
        this.callNative(path, callback);
    }
}

/**
 * Get popinfoId from native or querystring.
 * @return {string} popinfo_id or null.
 */ 
Popinfo.prototype.getPopinfoId = function(){
    var self = this;
    this.getValue(
        'popinfoId', 'jp.popinfo/popinfoId', function(popinfoId){
            self.popinfoId = popinfoId;
            self.dispatch('popinfoId', popinfoId);
        });
}

/**
 * Get location information from native or querystring.
 * @return {string} undefined
 */ 
Popinfo.prototype.getLocation = function(){
    return undefined; // not implemented.
}

/**
 * Get WiFi information from native or querystring.
 * @return {string} undefined
 */ 
Popinfo.prototype.getWiFi = function(){
    return undefined; // not implemented.
}

this.Popinfo = Popinfo;
