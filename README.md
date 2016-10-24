# Web front-end boilerplate

## Compilation des assets

Se rendre dans le dossier `public/sources`.
Les libs à concaténer dans le fichier js final sont à placer dans `public/sources/libs`.

### Compilation en continue (avec livereload)
```sh
gulp watch
```

### Compilation en continue avec browser-sync (avec livereload)
```sh
gulp watch --bs
```

Par défaut, browser-sync se branche sur l'adresse 'localhost' (à changer dans le fichier `config.json si besoin). Il est possible de préciser une autre URL

Exemple :
```sh
gulp watch --bs localhost:8000
```

### Compilation des assets one-shot
```sh
gulp build
```

### Compilation pour la prod

Il est possible d'ajouter un paramètre `--prod` aux tâches `build` et `watch` pour compiler les assets pour la prod. L'environnement par défaut peut être changé dans le fichier `config.json`.