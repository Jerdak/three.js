/**
 * @author jeremy carson / http://seethroughskin.com/
 */

var Dialog = function () {
    var scope = this;
    // Generate a unique random ID
    this.guid = function() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    this.remoteDialog = function ( title, url, callback ) {
        var uuid = this.guid();

        // <div id=div+uuid>
        var newDiv = document.createElement("div"); 
        newDiv.setAttribute("id","dialog"+uuid);
        newDiv.setAttribute("title",title);

        var newSelect = document.createElement("select");
        newSelect.setAttribute("id","files"+uuid);
        newSelect.setAttribute("name","files"+uuid);
        newDiv.appendChild(newSelect);

        document.body.appendChild(newDiv); 

        $.get( url, function(resp) {
            var tok = resp.split('\n');
            var optGroup = document.createElement("option");
            optGroup.innerHTML = "Select a File";
            optGroup.setAttributeNode(document.createAttribute("disabled"));
            optGroup.setAttributeNode(document.createAttribute("selected"));

            newSelect.appendChild(optGroup);

            for(i=0;i<tok.length;++i){
                var newOption = document.createElement("option");
                console.log("tok[i]: ",tok[i])
                newOption.innerHTML = tok[i];
                newSelect.appendChild(newOption);
            }
            $( "#dialog"+uuid ).dialog();
        });

        $( "#files"+uuid ).change(function() {
            console.log("Selected file: " + $("#files"+uuid+" :selected").text());
            if(callback)callback($("#files"+uuid+" :selected").text());
        });
    }
}