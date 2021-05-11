# Analýza aplikačních firewallů pomocí Selenia

Jsou analyzovány aplikační firewally sociálních sítí:
- Facebook (včetně mBasic Facebook)
- Twitter
- LinkedIn
- YouTube

[text]: <https://github.com/radimzitka/BP-app/blob/main/text.pdf>
[readme]: <https://github.com/radimzitka/BP-app/blob/main/app/README.md>
Každá sociální síť je otestována jednotlivými testy, jejichž smysl a význam je popsán v sekci 6.2 v souboru [text.pdf][text].

Pro spuštění jednotlivých testů je třeba umístit do složky `/drivers` konkrétního testu patřičný ovladač. Tyto ovladače jsou dostupné třeba na: https://chromedriver.chromium.org/downloads. Složka je ve výchozím stavu prázdná, protože ovladač je závislý na stanici, ze které se bude test spouštět. Bez patřičného ovladače test *nebude fungovat*.


## Spuštění analýzy reálné sociální sítě
Skript, který spouští okno prohlížeče je klasický Python skript. Předpokládá se použití webového prohlížeče Google Chrome. Skript ve složce Facebook je v operačních systémech Linux spuštěn následovně:

```sh
python3 main.py
```

Je vyžadován balík `python3-selenium`. Pokud ho nemáte nainstalovaný, nainstalujete ho příkazem:

```sh
sudo apt install python3-selenium
```

Jednotlivé vlastnosti testu mohou být upravovány přímo v kódu a záleží na uživateli, který test požaduje provést - seznam testů, které byly provedeny, jsou popsány v sekci 6.2 v souboru [text.pdf][text].

---

## Testování funkcí navrhovaného aplikačního firewallu
Ve složce `selenium_tests` je implementace testů, které ověřují, zda aplikační firewall sítě Socnet dokáže odhalit automatického bota pomocí implementovaných funkcí. Smysl jednotlivých testů obsahuje sekci 7.4 v souboru [text.pdf][text]. Princip a spuštění testujících skriptů je stejný jako v předchozí sekci, ale je třeba mít spuštěný server, na kterém běží síť Socnet. Popis spuštění tohoto serveru je v [tomto README][readme]. Jednotlivé testy jsou:

- Test počtu neúspěšných přihlášení (skript `bad_password.py`)
- Test počtu úspěšných přihlášení (skript `successfull_login.py`)
- Testování nesprávné hodnoty `User-Agent` (skript `bad_user_agent.py`)
- Test chování uživatele na sociální síti (skript `identic_behave.py`)
