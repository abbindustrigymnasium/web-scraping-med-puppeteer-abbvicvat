
puppeteer = require("puppeteer");
fs = require("fs");



const getClasses = async () => {
    // Start a Puppeteer session with:
	// - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
	// - no default viewport (`defaultViewport: null` - website page will be in full width and height)
	const browser = await puppeteer.launch({
	  	headless: true,
	  	defaultViewport: null,
	});
    
	// Open a new page
	const page = await browser.newPage();
    
	// On this new page:
	// - open the "http://quotes.toscrape.com/" website
	// - wait until the dom content is loaded (HTML is ready)
	await page.goto("https://cloud.timeedit.net/abbindustrigymnasium/web/public1/ri1Y7X6QQ7fZY6QfZ507o585y0YQ2ZjqQ1.html#", {
        waitUntil: "domcontentloaded",
	});
  
	cnt = 0;
	quotes = [];
    // Get page data
    const classList = await page.evaluate(() => {
        // Skapa en lista med attributen och ett objekt för lektioner
        const attributes = ["weekDay", "course", "info", "teachers", "activity", "special", "comment", "day", "month", "startTime", "endTime"]
        const classObj = {
            id: 0,
            weekDay: "",
            day: "",
            month: "",
            startTime: "",
            endTime: "",
            course: "",
            info: "",
            teachers: [],
            activity: "",
            special: "",
            comment: "",
        }

        // Hämta alla element som har klass weekDay
        const dayList = document.querySelectorAll(".weekDay");

        let classList = [];
        // Gå igenom alla dagar
        for (dayDiv of dayList) {
            let date = dayDiv.querySelector(".daytext").innerText;
            // vissa whitespaces hade char code 160 istället för 32 av nån anledning
            // byt ut dom mot vanglia whitespaces
            date = date.replace(String.fromCharCode(160), ' ');
            
            // date har formatet (weekDay day/month), splitta på whitespace och /
            date = date.split(/[ \/]/);
            
            let weekDay = date[0];
            let day = date[1];
            let month = date[2];

            // Hämta elementen i dayDiv som har klasserna .bookingDiv.fgDiv.clickable2
            // de är dagens lektioner
            classDivs = dayDiv.querySelectorAll(".bookingDiv.fgDiv.clickable2");
            for (classDiv of classDivs) {
                // classInfo blir ett objekt som ser likadant ut som classObj
                // i classInfo sparar vi all data om lektionen
                let classInfo = {
                    ...classObj
                };

                // alla lektioner ska ha ett unikt id

                classInfo["id"] = classList.length;

                classInfo["weekDay"] = weekDay;
                classInfo["day"] = day;
                classInfo["month"] = month;

                // classDiv har ett attribut title där tiderna för lektioner finns
                // tiderna är på formatet hh:mm
                // gå igenom strängen och leta efter : för att hitta tidern
                let title = classDiv.title, times = [];
                for(let i = 0; i < title.length; i++) if(title[i] == ':') times.push(title.substring(i - 2, i + 3));
                classInfo["startTime"] = times[0];
                classInfo["endTime"] = times[1];

                // attributen i attributes med index mellan 1 och 6 hämta jag här
                // alla dom finns i element i classDiv som har klassen .c men den på index 1 har också klassen .col1, index 2 har .col2 osv
                // därför är ordningen på attributen i attributes viktig
                for (let i = 1; i <= 6; i++) {
                    try {
                        // hämta info om attributes[i]
                        classInfo[attributes[i]] = classDiv.querySelector(".c.col" + i).innerText.replace(String.fromCharCode(160), ' ');
                        // om det är attributet är teachers gör man om det till en lista av lärare
                        if (attributes[i] === "teachers")  classInfo[attributes[i]] = classInfo[attributes[i]].split(' \n')
                    } catch (error) {
                        
                    }
                }
                // lägg till lektionen till listan av lektioner
                classList.push(classInfo);
            }
        }

        return classList;
    });

    let jsonData = JSON.stringify(classList);
    JSON.parse(jsonData)
    fs.writeFile("raw-data.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });

    // fixa en lista med alla lärare
    let teachers = [];
    for (item of classList) 
        for (teacher of item["teachers"])
            if (!teachers.includes(teacher)) // om läraren inte redan är i listan lägger vi till den
                teachers.push(teacher);

    jsonData = JSON.stringify(teachers);
    JSON.parse(jsonData)
    fs.writeFile("teachers.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });

    // fixa en lista med alla kurser
    let courses = [];
    for (item of classList) {
        let course = item["course"];
        // det var nån kurs som hade längd 0, den tar vi bort
        if (course.length !== 0 && !courses.includes(course))
            courses.push(course);
    }

    jsonData = JSON.stringify(courses);
    JSON.parse(jsonData)
    fs.writeFile("courses.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
	
	// Close the browser
	await browser.close();
};
  
// Start the scraping
getClasses();
