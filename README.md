# Bakalářská práce

---

## _Analýza aplikačních firewallů sociálních sítí_

Tento README slouží jako průvodce ke zdrojovým kódů bakalářské práce. Je doporučeno přečíst si minimálně Úvod v souboru `text.pdf`.

Hlavní cíl práce je detekce botů, kteří navštěvují webovou stránku za účelem webscrapingu. Jsou navrhnuty a implementovány ochrany detekující automatické boty. Architektura ochran vychází z analýzy aplikačních firewallů reálných sociálních sítí a jejím cílem je vylepšit stávající ochrany proti automatickým botům.

---


**Univerzita:** Vysoké učení technické v Brně

**Fakulta:** Fakulta informačních technologií

**Ústav:** ÚITS (Ústav inteligentních systémů)

**Kategorie:** Bezpečnost

**Rok vypracování práce:** 2020/2021

**Autor práce:** Radim Zítka, xzitka07@stud.fit.vutbr.cz

**Vedoucí:**    Ing. Filip Januš, ijanus@fit.vutbr.cz

**Oponent:** Mgr. Kamil Malinka, Ph.D.

**Zadání:**
1. Seznamte se základy automatického získávání dat z webu (tzv. web scraping).
2. Prostudujte dostupné materiály na téma aplikační firewally, zaměřte se na detekci botů.
3. Identifikujte aktuálně používaná opatření proti technice web scraping.
4. Analyzujte identifikovaná opatření a diskutujte jejich vlastnosti.
5. Navrhněte a implementujte vylepšení vybraného bezpečnostního opatření.
6. Demonstrujte přínos vašeho řešení.

---

   [app]: <https://github.com/radimzitka/BP-app/blob/main/app/README.md>
   [selenium]: <https://github.com/radimzitka/BP-app/blob/main/selenium_tests/README.md>
   [text]: <https://github.com/radimzitka/BP-Documents/blob/master/Makefile>
   
## Jednotlivé části práce

- [`/app`][app]  | [README][app] |  Zdrojové soubory simulované sociální sítě Socnet (Node.js)
- [`/selenium_tests`][selenium] | [README][selenium] | Zdrojové soubory pro analýzu firewallů reálných sociálních sítí pomocí Selenia (Python)
- [`/text`][text] Zdrojové soubory pro tvorbu textu bakalářské práce (pro překlad použijte [Makefile][text]), uložen v **jiném repozitáři! [zde][text]**
- `text.pdf` Text práce -- zde je popsána veškerá logika implementovaných funkcí aplikačního firewallu

Každá složka má svůj README, kde je popsáno, k čemu soubory slouží, a jak je lze spustit.

---
