# node-simple-chat

Atelier organisé à [Norsys][1] ayant pour but de créer une application de chat avec gestion de plusieurs salles en utilisant Node.js et Socket.io.

## 1. Hello Express!
La première étape consiste à installer Express.js globalement sur le système puis de s'en servir pour générer un squelette d'application Node.js.
```
npm install -g express@3.4.8
express simple-blog
cd simple-blog
npm install
```

Une fois ceci fait il suffit de lancer la commande suivant pour démarrer un serveur:
```
node app
```

Par défaut, Express est configuré pour utilisé le port 3000. L'application que vous venez de démarrer est accessible l'adresse suivante: [localhost:3000][2]

### 1.1. Redémarrage automatique du serveur
Un outil supplémentaire peut être installé pour surveiller tout changement dans les fichiers du projet et redémarrer automatiquement le serveur pour les appliquer.
```
npm install -g nodemon
```

Pour utiliser cet outil, il suffit de démarrer le serveur avec la ligne suivante:
```
nodemon app
```

### 1.2. Utilisez Express en mode statique
Pour cet atelier, nul besoin des fonctionalités complexes de template offertes par Express. Supprimez les lignes suivantes du code:
```
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
...
app.use(app.router);
...
app.get('/', routes.index);
app.get('/users', user.list);
```

Créez une page _index.html_ simple que vous mettrez dans le dossier _public_ de l'application.

## 2. Connection au chat
Installez Socket.io comme indiqué dans [la documentation][3] et utilisez la section _Using with the Express 3 framework_ pour la configuration du serveur ainsi que du client. Notez que, pour ce qui est du client, le fichier _socket.io.js_ n'est pas copié manuellement mais mis à la disposition automatiquement par la bibliothèque.

Socket.io offre plusieurs fonctionnalités utiles à cet atelier:
- `socket.on(event, callback)`: écoute un évenement
- `socket.emit(event, data, callback)`: envois un évenement au client si côté serveur et au serveur si côté client
- `socket.broadcast.emit(event, data)`: envois un évenement à tous les clients enregistrés excepté celui actuellement traitée (utilisée côté serveur uniquement)

Pour cette première partie, nous allons simplement enregistrer les utilisateurs du chat auprés du serveur.

1. __[Client]__ Créez un formulaire de connection au chat permettant à un utilisateur de saisir son pseudonyme.
2. __[Client]__ Configurez la validation du formulaire pour envoyer au serveur un évenement `join` avec le pseudonyme de l'utilisateur en paramètre.
3. __[Serveur]__ Réceptionnez l'évenement `join`, enregistrez le pseudonyme du client dans la socket et écrivez un log dans la console.

## 3. Affichage des nouveaux arrivants
Lorsqu'un utilisateur se connecte, nous voulons envoyer un message à tous les autres utilisateurs pour l'annoncer.

1. __[Serveur]__ Emettez un broadcast d'un évenement `join` lors d'une connection avec le pseudonyme de nouvel arrivant.
2. __[Client]__ Ecoutez les évenements `join` et affichez sur la page _"XYZ s'est connecté au chat"_.
3. __[Bonus Client]__ Affichez la liste des utilisateurs connectés au chat.

### 3.5. Affichage des utilisateurs connectés
Afin de rendre l'utilisation du chat plus agréable, nous voulons afficher et maintenir la liste des utilisateurs connectés.

1. __[Client]__ Affichez la liste des utilisateurs connectés au chat
2. __[Serveur]__ Ecoutez les évenement `disconnect` et émettez un broadcast pour annoncer qu'un utilisateur s'est déconnecté
3. __[Bonus Client]__ Maintenez la liste des utilisateurs connectés à jour

## 4. Envoi de message
Développons maintenant la fonctionalité principale du chat. La mise en place est très similaire à la fonctionalité de connection.

1. __[Client]__ Créez un formulaire permettant d'envoyer un nouveau message. Configurez le pour emettre un évenement `text` avec le contenu du message puis affichez sur la page le message envoyé.
2. __[Serveur]__ Ecoutez les messages envoyés par le client et les transmettez aux autres clients.
2. __[Client]__ Ecoutez les messages des autres clients transmis par le serveur et affichez les sur la page.

## 5. Création d'une chatroom
Afin de discuter d'un sujet plus précis, nous voulons donner la possiblité aux clients de se connecter à une chatroom pour pouvoir discuter en plus petit commité.

1. __[Client]__ Créez un autre formulaire permettant d'entrer le nom d'une chatroom à laquelle se joindre. Comme d'habitude, configurez le pour emettre un évenement pour le serveur.
2. __[Serveur]__ Ecoutez le nouvel évenement créé et enregistrez l'information dans la socket du client. Emettez un évenement en broadcast à tous les autres clients connectés à la chatroom avec `socket.broadcast.to(room).emit()`.
3. __[Client]__ Ecoutez les nouvelles arrivées sur la chatroom et affichez les.

## 6. Envoi de message à une chatroom
Dernière étape, permettre l'échange de message sur une chatroom.

1. __[Client]__ Envoyez un message avec le nom de la salle en paramètre.
2. __[Serveur]__ Réceptionez les messages et transmettez les aux autres clients connectéés à la salle.
3. __[Client]__ Réceptionnez les messages envoyés sur la salle et affichez les.

[1]: http://www.norsys.fr/
[2]: http://localhost:3000
[3]: http://socket.io/#how-to-use
