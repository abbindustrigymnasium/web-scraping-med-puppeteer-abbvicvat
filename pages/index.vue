<template>
	<div id="body" class="pt-5">
        <div id="checkboxes" class="flex flex-row justify-around">
            <div id="teacherList" class="flex flex-col justify-between">
                <button class="bg-gray rounded-xl" @click="empty('teacherCheckbox', false)"> Töm </button>
                <div class="flex flex-row" v-for="teacher in teacherList">
                    <input class="teacherCheckbox" type="checkbox" checked @click="flipTeacher(teacher)">
                    <p class="ml-5"> {{ teacher }} </p>
                </div>
                <button class="bg-gray rounded-xl" @click="empty('teacherCheckbox', true)"> Fyll </button>
            </div>

            <button class="bg-pink w-1/5 h-10 rounded-xl" @click="onlyTests = !onlyTests;">
                {{ onlyTests ? 'Visa Allt' : 'Endast Prov' }}
            </button>
            
            <div id="courseList" class="flex flex-col justify-between">
                <button class="bg-gray rounded-xl" @click="empty('courseCheckbox', false)"> Töm </button>
                <div class="flex flex-row" v-for="course in courseList">
                    <input class="courseCheckbox" type="checkbox" checked @click="flipCourse(course)">
                    <p class="ml-5"> {{ course }} </p>
                </div>
                <button class="bg-gray rounded-xl" @click="empty('courseCheckbox', true)"> Fyll </button>
            </div>

        </div>

        <div class="mt-5 w-full flex flex-row flex-wrap justify-around"> 
            <div class="bg-yellow rounded-xl w-1/5 m-2 flex flex-col justify-start items-center" v-for="item in filteredClassList" :key="item.id">
                <p class="" v-for="property in properties" :key="property" v-if="item[property].length !== 0 && property !== 'teachers' && (property !== 'comment' || item['comment'] !== item['info'])"> 
                    {{ property }}: {{ item[property] }}
                </p>
                <p v-for="teacher in item['teachers']" :key="teacher"> Teacher: {{ teacher }} </p>
            </div>
        </div>
    
	</div>
</template>

<script>

export default {
    name: 'IndexPage',

    data() {
        return {
            classList: require("../scraping/data.json"),

            teacherList: require("../scraping/teachers.json"), // Lista över alla lärare
            teachers: require("../scraping/teachers.json"),    // Lista över vilka lärare som visas

            courseList: require("../scraping/courses.json"),   // Lista över alla ämnen
            courses: require("../scraping/courses.json"),      // Lista över vilka ämnen som visas

            properties: ["weekDay", "day", "month", "startTime", "endTime", "course", "info", "teachers", "special", "comment"],
            onlyTests: false,
        }
    },

    computed: {
        // Man ska kunna filtrera ut lektioner bereonde på t.ex om det är prov, vilken kurs, lärare osv
        filteredClassList() {
            return this.classList.filter(item => {
                // Om ret är true kommer den här lektionen vara med i filteredClassList
                let ret = true;

                if(this.onlyTests) {
                    // Ta det som står i "info" på lektionen och gör till små bokstäver
                    let info = item["info"].toLowerCase();
                    // Om det varken står prov eller np är det antagligen inte prov den här lektionen, vi sätter ret till false
                    if(info.includes("prov") == false && info.includes("np") == false) ret = false;
                }

                // om ret inte redan är false kollar vi på kurserna
                if (ret) {
                    let course = item["course"];
                    if (!this.courses.includes(course)) ret = false;
                }

                // om ret inte redan är false kollar vi på lärarna
                if (ret) {
                    // om nån lärare i teachers håller lektionen, sätter vi ret till true
                    ret = false;
                    for (let teacher of this.teachers) if (item["teachers"].includes(teacher)) ret = true;
                }

                return ret;
            })
        },
    },

    methods: {
        flipTeacher(teacher) {
            // om läraren visas gör vi att den inte visas, om den inte visas gör vi att den visas
            console.log(teacher);
            if (this.teachers.includes(teacher)) this.teachers = this.teachers.filter(t => t !== teacher)
            else this.teachers.push(teacher)
        },
        flipCourse(course) {
            // om ämnet visas gör vi att det inte visas, om den inte visas gör vi att det visas
            console.log(course);
            if (this.courses.includes(course)) this.courses = this.courses.filter(t => t !== course)
            else this.courses.push(course)
        },
        empty(className, fill) {
            // className är antingeng teacherCheckbox eller courseCheckbox
            // fill är antingen true eller false, om fill är true gör vi att alla visas
            // annars gör vi att ingen visas

            // hämta alla checkboxes med klass className
            let boxes = document.getElementsByClassName(className);
            for (let box of boxes) if (box.checked !== fill) { // om box.checked !== fill klickar vi på den
                console.log(box.checked);
                box.click();
            }
        }
    }
}
</script>

<style scoped>
    .teacherCheckbox{

    }

    .courseCheckbox{
        
    }
</style>