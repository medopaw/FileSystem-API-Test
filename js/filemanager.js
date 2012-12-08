var glb = {
    fs: null,
    dir: null,
    NAME_LEN: 5
};

(function() {
    var engine = new Engine([{
            work: initFS
        }, {
            count: 100,
            work: createRandEntry
        }], function() {
    });
    engine.start();
})();

function initFS() {
    try {
        var runner = this.engine;
        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(TEMPORARY, 1024 * 1024, function(fs) {
            glb.fs = fs;
            glb.dir = fs.root;debug(glb.dir.fullPath);
            runner.check();
        }, errorHandler);
    } catch (ex) {
        debug(ex);
    }
}

function createRandEntry() {
    var runner = this.engine;
    var dirs = [glb.dir];
    var engine = new Engine([{
        work: function() {
            var engine = this.engine;
            glb.dir.getParent(function(result) {
                dirs.push(result);
                engine.check();
            }, errorHandler);
        }
    }, {
        work: function() {
            var engine = this.engine;
            glb.dir.createReader().readEntries(function(results) {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].isDirectory) {
                            dirs.push(results[i]);
                        }
                    }
                }
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
