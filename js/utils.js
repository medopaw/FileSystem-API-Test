var DEBUG = 1;

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
