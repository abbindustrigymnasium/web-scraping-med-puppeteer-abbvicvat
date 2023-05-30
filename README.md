# Timeedit 0.5

## Syfte

Syftet med projektet är att man ska kunna titta på schemat och lätt filtrera lektioner efter lärare, ämnen och prov
En nackdel är att sidan är mycket fulare än timeedit

## Skrapa

För att skrapa datan går du in i mappen `scraping` och kör:

```bash
# Skrapa datan
$ node scrape.js

# Tar data som skrapades och gör rent den
$ node clean.js
```

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```