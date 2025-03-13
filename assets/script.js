const data = document.querySelector("#inputData");
const contentItems = document.querySelector("#content");

const addItem = () => {
    if (data.value.trim()) {

        const listItem = document.createElement("li");
        listItem.innerHTML = `${data.value} <i class="fa fa-times"></i>`;


        data.value = "";


        listItem.addEventListener("click", () => {
            listItem.classList.toggle("done");
        });


        listItem.querySelector("i").addEventListener("click", (event) => {
            event.stopPropagation();
            listItem.remove();
        });

        contentItems.prepend(listItem);
    } else {
        alert("Please enter a task!");
    }
};

// enter
document.querySelector("#clickbtn").addEventListener("click", addItem);


data.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addItem();
    }
});
