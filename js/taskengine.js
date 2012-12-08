Engine = function(tasks, onend) {
    this.end = onend || function() {};
    this.progress = 0;
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].engine = this;
        tasks[i].test = tasks[i].test || function() {return true;};
        tasks[i].onpass = tasks[i].onpass || function() {debug('onpass');
            if (this.count) {
                this.count--;
                this.work();
            } else {
                var engine = this.engine;
                engine.progress++;
                debug('progress:'+engine.progress);
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
};

Engine.prototype.start = function() {
    if (this.tasks.length > 0) {
        this.tasks[0].work();
    }
};

Engine.prototype.check = function() {debug('check:'+this.progress);
    var task = this.tasks[this.progress];
    task.test() ? task.onpass() : task.onfail();
}
