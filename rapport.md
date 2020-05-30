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

## Step 4: AJAX requests with JQuery

## Step 5: Dynamic reverse proxy configuration