/*
 * Axure Utils - Core utilities for Axure prototypes
 */
const START_URL_NAME = 'start.html';
const PAGE_ID_NAME = 'id';
const PAGE_URL_NAME = 'p';
const SITEMAP_COLLAPSE_VAR_NAME = 'c';
const SITEMAP_COLLAPSE_VALUE = "1";
const SITEMAP_CLOSE_VALUE = "2";
const GLOBAL_VAR_NAME = 'ZQZ=s&';
const GLOBAL_VAR_CHECKSUM = 'CSUM';

(function() {
    // define the root namespace object
    if(!window.$axure) window.$axure = {};

    $axure.utils = {};

    // Makes an object bindable
    $axure.utils.makeBindable = function(obj, events) {
        if(obj.registeredBindings != null) return;

        obj.bindableEvents = events.slice();
        obj.registeredBindings = {};

        obj.bind = function(eventName, fn) {
            var binding = {};
            binding.eventName = eventName;
            binding.action = fn;

            var bindingList = this.registeredBindings[eventName];
            if(bindingList == null) {
                bindingList = [];
                this.registeredBindings[eventName] = bindingList;
            }
            bindingList[bindingList.length] = binding;
        };

        obj.unbind = function(eventName) {
            if(eventName.indexOf('.') >= 0) {
                this.registeredBindings[eventName] = null;
            } else {
                var event = eventName.split('.')[0];
                for(var bindingKey in this.registeredBindings) {
                    if(bindingKey.split('.')[0] == event) {
                        this.registeredBindings[bindingKey] = null;
                    }
                }
            }
        };

        obj.triggerEvent = function(eventName, arg) {
            for(var bindingKey in this.registeredBindings) {
                if(bindingKey.split('.')[0] == eventName) {
                    var bindings = this.registeredBindings[bindingKey];
                    for(var i = 0; i < bindings.length; i++) {
                        if(arg == null) {
                            bindings[i].action();
                        } else {
                            bindings[i].action(arg);
                        }
                    }
                }
            }
        };
    };

    $axure.utils.loadCSS = function(url) {
        $('head').append('<link type="text/css" href="' + url + '" rel="Stylesheet" />');
    };

    $axure.utils.loadJS = function(url) {
        $('head').append('<script type="text/javascript" language="JavaScript" src="' + url + '"></script>');
    };

    $axure.utils.curry = function(fn) {
        var curriedArgs = Array.prototype.slice.call(arguments, [1]);
        return function() {
            fn.apply(this, curriedArgs.concat(Array.prototype.slice.call(arguments)));
        };
    };

    $axure.utils.succeeded = function(result) {
        return result && result.success;
    };

    $axure.utils.createUniqueTag = function() {
        return Math.random().toString().substring(2) +
            Math.random().toString().substring(2) +
                Math.random().toString().substring(2) +
                    Math.random().toString().substring(2);
    };

    // Basic URL parameter handling
    $axure.utils.getHashStringVar = function(name) {
        var hash = window.location.hash;
        if(hash && hash.length > 1) {
            var params = hash.substring(1).split('&');
            for(var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                if(param[0] === name) {
                    return decodeURIComponent(param[1]);
                }
            }
        }
        return null;
    };

    $axure.utils.setHashStringVar = function(name, value) {
        var hash = window.location.hash;
        var params = [];
        if(hash && hash.length > 1) {
            params = hash.substring(1).split('&');
        }
        
        var found = false;
        for(var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if(param[0] === name) {
                params[i] = name + '=' + encodeURIComponent(value);
                found = true;
                break;
            }
        }
        
        if(!found) {
            params.push(name + '=' + encodeURIComponent(value));
        }
        
        window.location.hash = params.join('&');
    };

})();