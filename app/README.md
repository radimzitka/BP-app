# Sociální síť Socnet
### _Simulovaná sociální síť s detekcí automatických botů_

Aplikační firewall této sítě rozpoznává automatické boty na základě několika faktorů:

- **Počet neúspěšných přihlášení** -- zda nedochází v posledních 30 sekundách k více než 3 pokusům o přihlášení se se špatným heslem.
- **Počet úspěšných přihlášení** -- zda se uživatel nepřihlásil v posledních 10 sekundách více než 5× do svého účtu.
- **Kontrola hodnoty `User-Agent`** -- zda má uživatelský `User-Agent` v HTTP hlavičce korektní tvar.
- **Chování uživatele na sociální síti** -- zda se uživatelské chování neopakuje až příliš podezřele za posledních 10 dnů.

[text]: <https://github.com/radimzitka/BP-app/blob/main/text.pdf>

Podrobněji jsou funkce aplikačního firewallu popsány v kapitole 7 na straně 37 v souboru [text.pdf][text]. 

**Postup instalace je uveden pro operační systém Linux Ubuntu. Pro ostatní systémy je postup velmi podobný a je dostupný na odkazech uvedených u každé instalace.**

## Instalace Node.js
Pro běh programu je nutné mít nainstalovaný Node.js ve svém počítači. Instalace je provedena příkazem (zdroj https://www.geeksforgeeks.org/installation-of-node-js-on-linux/):

```sh
sudo apt install nodejs
```

Ověření, zda se Node.js nainstaloval správně, je možno ověřit příkazem:

```sh
node -v 
```

Dále je doporučeno mít nainstalovaný balík **npm**:

```sh
sudo apt install npm
```

Je doporučeno nainstalovat si démona **nodemon** pro pohodlnější spuštění aplikace:

```sh
sudo npm install -g nodemon
```

## Instalace databáze Mongo.DB

Databáze Mongo.DB je nezbytná pro správný běh sítě Socnet. Instalaci je doporučeno provést podle tohoto postupu: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/. Dále je nutné databázi spustit.

Pro správu databáze je doporučován nástroj MongoDB Compass, který umožňuje správu databáze přes grafické uživatelské rozhraní (popis instalace zde: https://docs.mongodb.com/compass/current/install/).

Databáze dle výchozího nastavení běží na portu **27017** (nastavení portu v souboru `config.js`).

Aby se mohli přihlásit uživatelé, je třeba vytvořit kolekci `users` (ostatní kolekce jsou vytvořeny automaticky). V souboru `users.json` je uloženi 3 uživatelé (včetně referenčního uživatele `user`). Tento soubor je třeba naimportovat pomocí MongoDB Compass do databáze. 


## Spuštění sítě Socnet
Pokud byl engine Node.js a databáze MongoDB nainstalovány správně, sociální síť je spuštěna příkazem (pomocí terminálu ve složce `/app`):

```sh
nodemon app.js
```

Aplikace běží ve výchozím stavu na portu 8080. Sociální síť Socnet tedy může být navštívena ve webovém prohlížeči na URL:

```sh
http://localhost:8080/
```

## Struktura souborů se složce `/app`

Soubor | Popis
--- | --- 
`/controllers` | Funkce pro správu session uživatele a renderování stránek
`/firewall/login.js` | Funkce, které jsou volány při přihlašování uživatele
`/models` | Popis databázových modelů používaných v aplikaci
`/node_modules` | Interní složka Node.js
`/views` | HTML kódy jednotlivých stránek sítě Socnet
`app.js` | Nastavení aplikace
`config.js` | Nastavení časových intervalů pro analýzu uživatele či doby blokace uživatele
`db.js` | Nastavení připojení k databázi
`router.js` | Směruje všechny požadavky, volá jednotlivé funkce kontroly při přihlašování uživatele
`users.js` | Soubor s uživateli ve formátu JSON (je nezbytné importovat tyto uživatele do databáze)
`package.json` a `package-lock.json` | Interní soubory Node.js

Uživatel by měl měnit pouze soubor `config.js`, který slouží pro nastavení časových intervalů, a soubor `users.json`, který importuje do databáze, popř. soubor `/firewall/config.js`, ve kterém lze změnit tabulku s povoleným počtem opakování (funkce `checkIdenticalApproach()` na řádku 211). 


[selenium]: <https://github.com/radimzitka/BP-app/tree/main/selenium_tests/Socnet-final>

Aplikační firewall je možné vyzkoušet Python skripty ve složce [/selenium_tests/socnet-final/][selenium] nebo ručně (poněkud složitější, je třeba věrně simulovat automatického robota).

