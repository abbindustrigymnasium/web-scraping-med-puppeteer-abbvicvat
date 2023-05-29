
puppeteer = require("puppeteer");
fs = require("fs");

const attributeOrder = ["weekDay", "day", "month", "course", "info", "teachers", "activity", "special", "comment"];
const classObj = {
    weekDay: "",
    day: "",
    month: "",
    course: "",
    info: "",
    teachers: [],
    activity: "",
    special: "",
    comment: "",
};


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

        // Fetch the first element with class "quote"
        // Get the displayed text and returns it
        const dayList = document.querySelectorAll(".weekDay");

        // Convert the dayList to an iterable array
        // For each day fetch the text and author
        let classList = [];
        let bla = [];
        for (dayDiv of dayList) {
            let date = dayDiv.querySelector(".daytext").innerText;
            // The whitespaces have the char code 160 instead of 32
            // so I replace those whitespaces with normal ones
            date = date.replace(String.fromCharCode(160), ' ');
            
            // date is of the format (weekDay day/month), split on whitespace and backslash
            date = date.split(/[ \/]/);
            
            let weekDay = date[0];
            let day = date[1];
            let month = date[2];

            classDivs = dayDiv.querySelectorAll(".bookingDiv.fgDiv.clickable2");
            for (classDiv of classDivs) {
                let classInfo = {
                    ...classObj
                };

                classInfo["id"] = classList.length;

                classInfo["weekDay"] = weekDay;
                classInfo["day"] = day;
                classInfo["month"] = month;
                let title = classDiv.title, times = [];
                for(let i = 0; i < title.length; i++) if(title[i] == ':') times.push(title.substring(i - 2, i + 3));
                classInfo["startTime"] = times[0];
                classInfo["endTime"] = times[1];

                for (let i = 1; i <= 6; i++) {
                    try {
                        classInfo[attributes[i]] = classDiv.querySelector(".c.col" + i).innerText.replace(String.fromCharCode(160), ' ');
                        if (attributes[i] === "teachers")  classInfo[attributes[i]] = classInfo[attributes[i]].split(' \n')
                    } catch (error) {
                        
                    }
                }

                classList.push(classInfo);
            }
        }

        return classList;

        return Array.from(dayList).map((day) => {
            // Fetch the sub-elements from the previously fetched quote element
            // Get the displayed text and return it (`.innerText`)
            const text = quote.querySelector(".text").innerText;
            const author = quote.querySelector(".author").innerText;

            return { text, author };
        });
    });

    // console.log("length")
    // console.log(classList.length)
    // console.log(classList)

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
        // det var nån kurs som hade längd 0
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
