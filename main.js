const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const alarm = document.getElementById("alarm");
const pomodoro = document.getElementById("pomodoro");
const short_break = document.getElementById("short-break");
const long_break = document.getElementById("long-break");
const items_container = document.getElementById("items");
const item_template = document.getElementById("itemTemplate");
const add = document.getElementById("add");

let items = getItems();
let timeLeft = 1500;
let interval;

const updateTimer = () =>{
    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft%60;

    timer.innerHTML = `${minutes.toString().padStart(2,"0")}
    :${seconds.toString().padStart(2,"0")}`;
}
const startTimer = () =>{
    if(interval){
        clearInterval(interval); // clears existing interval
    }
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if(timeLeft === 0){
            clearInterval(interval);
            breakGif.style.display = "block";
            alarm.play();
            timeLeft = 1500;
            updateTimer();
        }
    },
     1000);
};
const stopTimer = () => {
    clearInterval(interval);
    alarm.pause();
}

const resetTimer = () => {
    breakGif.style.display = "none";
    clearInterval(interval);
    alarm.pause();
    timeLeft = 1500;
    updateTimer();
}

const shortBreakTime = () =>{
    timeLeft = 300;
    startTimer();
}

const longBreakTime = () =>{
    timeLeft = 900;
    startTimer();
}

function getItems(){
    const value = localStorage.getItem("todo-test") || "[]";
    return JSON.parse(value);
}
function setItems(items){
    const itemsJson = JSON.stringify(items);
    localStorage.setItem("todo-test",itemsJson);
}
function addItem(){
    items.unshift({
        description: "",
        completed: false
    }); // adds item to begining of array
    setItems(items);
    refreshList();
}
function updateItem(item , key, value){
    item[key] = value;
    setItems(items);
    refreshList();

}
function refreshList(){
    // sort items
    items.sort((a,b) => {
        if(a.completed){
            return 1;
        }
        if(b.completed){
            return -1;
        }

        return a.description < b.description ? -1 : 1;

    });
    items_container.innerHTML = "";

    for (const item of items) {
        const itemElement = item_template.content.cloneNode(true);
        const descriptionInput = itemElement.querySelector(".item-description");
        const completedInput = itemElement.querySelector(".item-completed");

        descriptionInput.value = item.description;
        completedInput.checked = item.completed;

        descriptionInput.addEventListener("change",() => {
            updateItem(item,"description",descriptionInput.value);
        });

        completedInput.addEventListener("change",() => {
            updateItem(item,"completed",completedInput.checked);
        });

        items_container.append(itemElement);
    }
}
refreshList();

add.addEventListener("click",() => {
    addItem();
});
start.addEventListener("click",startTimer);
stop.addEventListener("click",stopTimer);
reset.addEventListener("click",resetTimer);
pomodoro.addEventListener("click",resetTimer);
short_break.addEventListener("click",shortBreakTime);
long_break.addEventListener("click",longBreakTime);
