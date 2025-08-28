# Signieren und Verifizieren von JSON Web Tokens (JWT)

In dieser Aufgabe wirst du einen Backend-Service erstellen, der Tokens (JWT) signiert und verifiziert.

## Was du machen wirst

## Aufgaben

### Aufgabe 1 - Installation der jsonwebtoken Bibliothek

Lies die Dokumentation und installiere die npm Bibliothek [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

> Hinweis: Einige Bibliotheken werden dir sagen, dass du `require()` verwenden sollst, aber da wir ES6 Module verwenden, können wir das Schlüsselwort `import` verwenden

### Aufgabe 2 - Erstellen eines geheimen Schlüssels

Da das Signieren unserer Tokens einen geheimen Schlüssel erfordert, werden wir eine .env Datei verwenden, um unser Geheimnis zu speichern

1. Erstelle eine neue Datei `.env` und erstelle die Eigenschaft `SECRET_KEY` mit einer zufälligen Zeichenkette
2. Denke daran, es beim Starten von Node zu verwenden

### Aufgabe 3 - Generierung des Tokens

1. Erstelle einen `utils` Ordner im Wurzelverzeichnis deines Projekts
2. Erstelle die Datei `jwt.js`
3. Importiere die `jsonwebtoken` Bibliothek

### Aufgabe 4 - Generierung des Tokens (Fortsetzung)

Schreibe nun eine `signToken` Funktion, die;

1. Einen **Benutzer** (Objekt) als Parameter erhält
2. Eine `payload` Variable erstellt, die die `email` und `_id` Eigenschaften des **Benutzers** enthält
3. Die `sign` Methode aus der `jsonwebtoken` Bibliothek verwendet, um ein Token mit der `payload` Variable zu erstellen
4. Verwende das folgende Konfigurationsobjekt, um ein Ablaufdatum von 1 Stunde ab jetzt festzulegen `{ expiresIn: '1h' }`

> Vergiss nicht, den Wert, der unter `process.env.SECRET_KEY` gespeichert ist, zum Signieren deines Tokens zu verwenden!
> Füge auch deine `payload` Variable beim Signieren des Tokens hinzu

#### Beispiel

```js
jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
```

### Aufgabe 5 - Verifizieren eines Tokens

In der gleichen Datei erstelle eine `verifyToken` Funktion, die;

1. Ein Token (String) als Parameter erhält
2. Die `verify` Methode aus der `jsonwebtoken` Bibliothek verwendet, um das Token zu verifizieren
3. Den Wert aus der `verify` Funktion zurückgibt

> Du wirst auch die `process.env.SECRET_KEY` Eigenschaft benötigen, um dein Token zu verifizieren!

### Aufgabe 6

Exportiere deine Funktionen `signToken` und `verifyToken` aus `jwt.js`

### Aufgabe 7 - Behandlung des Login-Verhaltens

In der Datei `routes/user.js`, im Request-Handler für den Endpunkt `"/login"`;

1. Suche mit der JSON **body** Eigenschaft `email` den Benutzer in dem Array, das aus `database.js` exportiert wird
2. Wenn der Benutzer nicht gefunden werden kann, oder die Eigenschaften `email` oder `password` nicht existieren;
   - Gib einen **404** Fehler zurück
3. Wenn der Benutzer gefunden werden kann;
   - Überprüfe, ob die Passwörter mit der JSON **body** Eigenschaft `password` übereinstimmen
   - Importiere und verwende die Funktion `signToken`, um ein **JSON Web Token** zu erstellen, und gib das **Token** in deiner Antwort an den Benutzer zurück

### Aufgabe 8 - Behandlung des Verifizierungsverhaltens

In der Datei `routes/user.js`, im Request-Handler für deinen Endpunkt `"/verify"`;

1. Importiere und verwende die Funktion `verifyToken`
2. Extrahiere die JSON **body** Eigenschaft `token` und führe sie durch die `verifyToken` Funktion
3. Wenn die `verifyToken` Funktion einen Fehler wirft, oder die `token` Eigenschaft nicht existiert;
   - **Fange** den Fehler und,
   - Gib einen **401** "unauthorized" Fehler an den Benutzer zurück
4. Wenn die `verifyToken` Funktion keinen Fehler wirft, gibt sie die Token Payload zurück
   - Gib die Payload an den Benutzer zurück

### Aufgabe 9 - Testen

Teste deine Anwendung mit einem API-Testtool und sende die erforderlichen JSON-Daten pro Endpunkt

Der Pfad für den Login-Prozess sollte `http://localhost:3001/login` sein und erwartet ein JSON-Objekt wie folgt:

```json
{
   "email": "nbiffen8@ycombinator.com",
   "password: "jfmdkdir"
}
```

Der Pfad für den Verifizierungsprozess sollte `http://localhost:3001/verify` sein und erwartet ein JSON-Objekt wie folgt:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmljZW5kb3IgZG9uZSBpbiB0aGUgY29kZSBibG9jayJ9.IOmqNfo2YqzGgUyU2kMAIaOcynKW6xPSRjWviNljTAo"
}
```

> Stelle sicher, dass du POST-Anfragen sendest!
