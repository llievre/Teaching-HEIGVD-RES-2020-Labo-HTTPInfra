$(function(){
    console.log("Loading emails");

    function loadEmails(){
        $.getJSON("/api/emails/", function(emails){
            console.log(emails);
            var message = "No data";

            if(emails.length > 0){
                var m = emails[0];
                message = m.email + " on domain " + m.domain + " with ip " + m.ip + " for Company " + m.company;
            }
	    
            $("#upemail").text(message);
        });
    };

    loadEmails();
    setInterval(loadEmails, 2000);
});
