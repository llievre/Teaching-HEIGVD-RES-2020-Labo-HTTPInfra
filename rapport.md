

# RES - Labo HTTP Infrastructure

Auteur : Lièvre Loïc

Date : 28.05.2020

## Introduction

## Step 1: Static HTTP server with apache httpd

### Image docker

On crée le fichier Dockerfile avec le contenu suivant afin de configurer notre image Apache avec PHP-7.2.

```
FROM php:7.2-apache
COPY src/ /var/www/html
```

On crée l'image à l'aide la commande `docker build -t res/apache_php`

### Lancement du container

On exécute le container docker à l'aide de la commande  :

`docker run -p 9090:80 res/apache_php`

![](images/s1_docker_run.png)

On peut voir le résultat en se rendant sur l'adresse `localhost:9090`.

Il est ensuite possible de lancer d'autres containers en utilisant d'autres ports libres.

### Template

Le template installé est `Sb Admin 2` téléchargeable sur le site de bootstrap sur [https://startbootstrap.com/themes/sb-admin-2/](https://startbootstrap.com/themes/sb-admin-2/).

Il a été épuré dans le but d'enlever les exemples de code fourni de base.

![](images/s1_website.png)

## Step 2: Dynamic HTTP server with express.js

### Image docker

On crée le fichier Dockerfile avec le contenu suivant afin de configurer notre image avec node 12.17.0.

```
FROM node:12.17.0
COPY src /opt/app

CMD ["node", "/opt/app/index.js"]
```

On crée l'image à l'aide la commande `docker build -t res/express_emails .`

### Code du index.js

```
var Chance = require("chance");
var chance = new Chance();
var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send(generateEmails())
});

app.listen(3000, function(){
    console.log('Accepting HTTP requests on port 3000.')
});

function generateEmails(){
    var numberOfEmails = chance.integer({
	min:0,
	max:10
    });

    console.log(numberOfEmails);

    var emails = [];
    
    for(var i=0;i<numberOfEmails;i++){
	var domain = chance.domain();
	var email = chance.email({domain: domain});
	var ip = chance.ip();
	var company = chance.company();
	emails.push({
	    domain: domain,
	    email: email,
	    ip: ip,
	    company: company
	});
    }
	
    console.log(emails);

    return emails;
}
```

### Lancement du container

On exécute le container docker à l'aide de la commande  :

`docker run -p 9091:3000 res/express_emails`

On peut ensuite se connecter depuis notre browser en se rendant sur `localhost:9091` afin de voir les résultats.

![](images/s2_emails.png)

On remarque aussi que le container docker affiche les même étant donné que nous affichons les résultats dans le code:

![](images/s2_docker_run.png)

## Step 3: Reverse proxy with apache (static configuration)

### Image docker

On crée le fichier Dockerfile avec le contenu suivant afin de configurer notre image contenant httpd afin de l'installer en reverse proxy:

```
FROM php:7.2-apache
COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
```

On crée l'image à l'aide la commande `docker build -t res/apache_rp .^`

### Fichiers de configuration

#### 000-default.conf

```
<VirtualHost *:80>
</VirtualHost>
```

#### 001-reverse-proxy.conf

```
<VirtualHost *:80>
	     ServerName demo.res.ch

	     ProxyPass "/api/emails/" "http://172.17.0.3:3000/"
	     ProxyPassReverse "/api/emails/" "http://172.17.0.3:3000/"

	     ProxyPass "/" "http://172.17.0.2:80/"
	     ProxyPassReverse "/" "http://172.17.0.2:80/"	     
</VirtualHost>
```

Comme demandé dans le podcast, les adresses IP sont en durs dans la configuration ce qui n'est pas idéal étant donné que les machines peuvent changer d'adresses au redémarrage avec docker et pourraient donc ne plus être accessible.

### Lancement du container

On lance le container du reverse proxy:

`docker run -p 9091:3000 res/apache_rp`

On lance les deux autres containers sans port d'accès afin d'éviter de pouvoir y accéder:

`sudo docker run -d --name apache_static res/apache_php`

`sudo docker run -d --name express_dynamic res/express_emails`

Les machines ne sont pas pas accessibles directement. (Sauf en tapant leurs adresses IP "docker" étant donné que mon OS est Linux et j'ai donc un accès direct aux machines.)

On regarde que la machine n'est pas accessible en ne passant pas par le nom de domaine désigné dans le fichier de configuration `demo.res.ch` et donc apache passe par le fichier `000-default.conf`.

![](images/s3_forbidden.png)

Mais si on utilise le nom de domaine, on passe donc par le fichier `001-reverse-proxy.conf`.

On distingue alors les deux cas, si on passe sur `/` on arrive sur le contenu HTML donné par la machine apache configurée pour servir le contenu statique.

![](images/s3_demo_res.png)

Si on passe par `/emails/*` on arrive sur le contenu généré par node js.

![](images/s3_api_emails.png)

Cette image montre que la machine virtuelle de l'API n'est pas joignable en passant par le port 3000 ou tourne l'application express :

![](images/s3_demo_res_3000.png)



## Step 4: AJAX requests with JQuery



## Step 5: Dynamic reverse proxy configuration