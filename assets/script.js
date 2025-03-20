const data = document.querySelector("#inputData");
const contentItems = document.querySelector("#content");
const taskCategory = document.querySelector("#taskCategory");
const dueDate = document.querySelector("#dueDate");
const priority = document.querySelector("#priority");
const filterButtons = document.querySelectorAll(".filter-btn");

//localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";



function renderTasks() {
    contentItems.innerHTML = "";
    const filteredTasks = currentFilter === "all"
        ? tasks
        : tasks.filter(task => task.category === currentFilter);

    filteredTasks.forEach((task, index) => {
        const listItem = createTaskElement(task, index);
        contentItems.appendChild(listItem);
    });
    saveTasks();
}

// Create task element
function createTaskElement(task, index) {
    const listItem = document.createElement("li");
    listItem.draggable = true;
    listItem.dataset.index = index;

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const categorySpan = document.createElement("span");
    categorySpan.className = "task-category";
    categorySpan.textContent = task.category.charAt(0).toUpperCase() + task.category.slice(1);

    const dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    dueDateSpan.textContent = task.dueDate ? `Due: ${formatDate(task.dueDate)}` : "";

    const prioritySpan = document.createElement("span");
    prioritySpan.className = `priority ${task.priority}`;
    prioritySpan.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fa fa-times";

    taskInfo.appendChild(taskText);
    taskInfo.appendChild(categorySpan);
    taskInfo.appendChild(dueDateSpan);
    taskInfo.appendChild(prioritySpan);

    listItem.appendChild(taskInfo);
    listItem.appendChild(deleteBtn);

    if (task.done) {
        listItem.classList.add("done");
    }

    listItem.addEventListener("click", (e) => {
        if (!e.target.classList.contains("fa-times")) {
            listItem.classList.toggle("done");
            tasks[index].done = !tasks[index].done;
            saveTasks();
        }
    });

    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        listItem.remove();
        tasks.splice(index, 1);
        saveTasks();
    });

    // Drag and Drop
    listItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", index);
        listItem.classList.add("dragging");
    });

    listItem.addEventListener("dragend", () => {
        listItem.classList.remove("dragging");
        // Update task order after drag
        const newTasks = [...tasks];
        const draggedIndex = parseInt(listItem.dataset.index);
        const newIndex = Array.from(contentItems.children).indexOf(listItem);
        const [movedTask] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(newIndex, 0, movedTask);
        tasks = newTasks;
        saveTasks();
    });

    listItem.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        const notDraggingItems = [...contentItems.querySelectorAll("li:not(.dragging)")];

        const nextItem = notDraggingItems.find(item => {
            const rect = item.getBoundingClientRect();
            return e.clientY <= rect.top + rect.height / 2;
        });

        if (nextItem) {
            contentItems.insertBefore(draggingItem, nextItem);
        } else {
            contentItems.appendChild(draggingItem);
        }
    });

    return listItem;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add new task
const addItem = () => {
    if (data.value.trim()) {
        const newTask = {
            text: data.value.trim(),
            category: taskCategory.value,
            dueDate: dueDate.value,
            priority: priority.value,
            done: false,
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        data.value = "";
        renderTasks();
    } else {
        alert("Please enter a task!");
    }
};

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

// Enter key to add task
data.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        addItem();
    }
});

// Initial render
renderTasks();
