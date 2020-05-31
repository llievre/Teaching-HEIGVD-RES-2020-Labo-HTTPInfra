<?php
	$dynamic_app = getenv('DYNAMIC_APP');
	$static_app = getenv('STATIC_APP');
?>
<VirtualHost *:80>
	     ServerName demo.res.ch

	     ProxyPass '/api/emails/' 'http://dynamic:3000/'
	     ProxyPassReverse '/api/emails/' 'http://dynamic:3000/'
	     
	     ProxyPass '/' 'http://static:80/'
	     ProxyPassReverse '/' 'http://static:80/'

	     #OLD CONFIG
	     #ProxyPass '/api/emails/' 'http://<?php print "$dynamic_app"?>/'
	     #ProxyPassReverse '/api/emails/' 'http://<?php print "$dynamic_app"?>/'	    
	     #ProxyPass '/' 'http://<?php print "$static_app"?>/'
	     #ProxyPassReverse '/' 'http://<?php print "$static_app"?>/'
</VirtualHost>