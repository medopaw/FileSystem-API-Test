var DEBUG = 1;
var CREATE_RANDOM_FILES = 1, RANDOM_FILES_COUNT = 100;
var SPACE_LIMIT = 1024 * 1024;
var MAIN_SCRIPT = "js/libs/require.js";

function debug(msg) {
    if (DEBUG) {
        console.log(msg);
    }
}

var utl = {
    randNum: function(max, min) {
        // e.g. randNum(2) could be 0 or 1
        if (min === undefined) min = 0;
        return Math.floor(Math.random() * (max - min)) + min;
    },
    randName: function(len) {
        if (len === undefined) len = glb.NAME_LEN;
        var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'];
        var name = '';
        for (var i = 0; i < len; i++) {
            name += chars[this.randNum(chars.length)];
        }
        return name;
    }
};

function TaskEngine(tasks, onend) {
    this.end = onend || function() {};
    this.progress = 0;
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].engine = this;
        tasks[i].test = tasks[i].test || function() {return true;};
        tasks[i].onpass = tasks[i].onpass || function() {
            if (this.count) {
                this.count--;
                this.work();
            } else {
                var engine = this.engine;
                engine.progress++;
                if (engine.progress < engine.tasks.length) {
                    engine.tasks[engine.progress].work();
                } else {
                    engine.end();
                }
            }
        };
        tasks[i].onfail = tasks[i].onfail || function() {};
    }
    this.tasks = tasks;
}

TaskEngine.prototype.start = function() {
    if (this.tasks.length) {
        this.tasks[0].work();
    }
};

TaskEngine.prototype.check = function() {
    var task = this.tasks[this.progress];
    task.test() ? task.onpass() : task.onfail();
}

var glb = {
    fs: null,
    dir: null,
    NAME_LEN: 5
};

(function() {
    var tasks = [{
        work: initFS
    }, {
       work: loadMainScript
    }];
    if (CREATE_RANDOM_FILES) {
        tasks.splice(1, 0, { // insert at 2nd place
            count: RANDOM_FILES_COUNT,
            work: createRandEntry
        });
    }
    var engine = new TaskEngine(tasks);
    engine.start();
})();

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
          break;
    };

    debug('Error: ' + msg);
}

function loadMainScript() {
    navigator.mozSDCard = {
        name: "SD Card",
        root: glb.fs.root
    };
    console.log(navigator.mozSDCard.root);
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var oScript= document.createElement("script");
    oScript.setAttribute("src", MAIN_SCRIPT);
    oScript.setAttribute("data-main", "js/filemanager");
    oHead.appendChild(oScript);
}

function initFS() {
    try {
        var runner = this.engine;
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(TEMPORARY, SPACE_LIMIT, function(fs) {
            glb.fs = fs;
            glb.dir = fs.root;
            runner.check();
        }, errorHandler);
    } catch (ex) {
        debug(ex);
    }
}

function createRandEntry() {
    var runner = this.engine;
    var dirs = [glb.dir];
    var engine = new TaskEngine([{
        test: function() {
            return this.parentDone && this.childrenDone;
        },
        work: function() {
            var _this = this, engine = this.engine;
            glb.dir.getParent(function(result) {
                dirs.push(result);
                _this.parentDone = true;
                debug('parent done:'+_this.parentDone+', children done:'+_this.childrenDone);
                engine.check();
            }, errorHandler);
            glb.dir.createReader().readEntries(function(results) {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].isDirectory) {
                        dirs.push(results[i]);
                    }
                }
                _this.childrenDone = true;
                debug('parent done:'+_this.parentDone+', children done:'+_this.childrenDone);
                engine.check();
            }, errorHandler);
        }
    }, {
        work: function() {
            // set dir randomly
            var r = utl.randNum(dirs.length);
            debug(r+'/'+dirs.length);
            glb.dir = dirs[r];
            // glb.dir = dirs[utl.randNum(dirs.length)];
            debug('work3:'+glb.dir.fullPath);
            var engine = this.engine;
            // create a random entry
            if (utl.randNum(2) == 0) {
                glb.dir.getDirectory(utl.randName(), {create: true}, function() {
                    debug('creating dir');
                    engine.check();
                }, errorHandler);
            } else {
                glb.dir.getFile(utl.randName(), {create: true}, function() {
                    debug('creating file');
                    engine.check();
                }, errorHandler);
            }
        }
    }], function() {
        runner.check();
    });
    engine.start();
}
