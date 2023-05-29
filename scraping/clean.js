fs = require("fs");

let rawdata = fs.readFileSync('raw-data.json');
let classList = JSON.parse(rawdata);

// den enda viktiga infon i "info" är om det är prov, och vad det är för prov
// jag vill ta bort det onödiga, t.ex vilka klasser som har lektionen
// det onödiga har nästan alltid '_' istället för ' ' mellan sig, förutom på moderna språk där det står "Mspr 4"
// på spanskan står det också "Spa" i info

for (let item of classList) {
    
    let info = item["info"];
    
    // Om Mspr 4 finns, ta bort det
    // Om Spa finns, ta bort det
    info = info.replace("Mspr 4", "");
    info = info.replace("Spa", "");
    
    let parts = info.split(' ');
    info = "";
    
    // splitta info på ' ', alla delar som innehåller '_' kan vi slänga bort;
    for (let part of parts) if (!part.includes('_') && part.length !== 0) {
        if(info.length !== 0) info += ' ';
        info += part;   
    }
    
    item["info"] = info;

    // Gå igenom alla strängar och ta bort whitespaces och line breaks från start och slut
    // byt ut whitespaces som kommer flera i rad mot ett whitespace;
    for (property in item) {
        if (property !== "teachers" && property !== "id") {
            item[property] = item[property].trim();
            item[property] = item[property].replace(/  +/g, ' ');
        }
    }
}

let jsonData = JSON.stringify(classList);
JSON.parse(jsonData)
fs.writeFile("data.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
});