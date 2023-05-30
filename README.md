# Timeedit 0.5

## Syfte

Syftet med projektet är att man ska kunna titta på schemat och lätt filtrera lektioner efter lärare, ämnen och prov
En nackdel är att sidan är mycket fulare än timeedit



## Setup
```bash
$ npm install
$ npm install @nuxt/content@^1
```

## Skrapa

För att skrapa datan går du in i mappen `scraping` och kör:

```bash
# Skrapa datan
$ node scrape.js

# Tar data som skrapades och gör rent den
$ node clean.js
```

## Köra projektet

```bash
# Köra projektet
$ npm run dev
```