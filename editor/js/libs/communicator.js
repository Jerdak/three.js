/*  Handle bi-directional communication between client and server.

    Requires:
        node.js
        express.js
        socket.io
*/

var Communicator = function () {
    this.socket = null;
}

Communicator.prototype = {
    initialize: function(url,port){
        this.socket = io.connect(url + ":" + port);
        this.url = url;
        this.port = port;

        /*socket.on('txt_change', function (data) {
          console.log(data.txt);
          $("#txt").val(data.txt);
        });*/
        var self = this;
        $(document).ready(function(){
          self.socket.emit("ready");
        });
    },

    registerPipe: function(evt,callback){
        if(callback){
            throw "invalid callback for pipe, unable to connect";
            return;
        }

        var data = callback();
        this.socket.emit(evt,data);
    },

    emit: function(evt,data){
        this.socket.emit(evt,data);
    },

    on: function(evt,callback){
        var cb = callback;
        this.socket.on(evt,function(data){
            console.log("Received data");
            cb(data);
        });
    }
}
