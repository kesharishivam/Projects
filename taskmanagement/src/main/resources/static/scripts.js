document.addEventListener('DOMContentLoaded', () => {
    const taskTitle = document.getElementById('task-title');
    const taskDesc = document.getElementById('task-desc');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksContainer = document.getElementById('tasks-container');

    const apiUrl = 'http://localhost:8080/api/tasks';

    // Fetch and display tasks
    const fetchTasks = async () => {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    };

    // Create task element
    const createTaskElement = (task) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task' + (task.completed ? ' completed' : '');
        taskDiv.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <p>${task.description}</p>
            </div>
            <div>
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        return taskDiv;
    };

    // Add task
    addTaskBtn.addEventListener('click', async () => {
        const newTask = {
            title: taskTitle.value,
            description: taskDesc.value,
            completed: false
        };
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });
        const savedTask = await response.json();
        const taskElement = createTaskElement(savedTask);
        tasksContainer.appendChild(taskElement);
        taskTitle.value = '';
        taskDesc.value = '';
    });

    // Toggle task completion
    window.toggleTask = async (id) => {
        const response = await fetch(`${apiUrl}/${id}`);
        const task = await response.json();
        task.completed = !task.completed;
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        fetchTasks();
    };

    // Delete task
    window.deleteTask = async (id) => {
        await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks();
    };

    // Initial fetch
    fetchTasks();
});
