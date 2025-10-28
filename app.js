// Navigation
const trackerPage = document.getElementById('trackerPage')
const todoPage = document.getElementById('todoPage')
document.getElementById('navTracker').onclick = () => {
	trackerPage.classList.remove('hidden')
	todoPage.classList.add('hidden')
}
document.getElementById('navTodo').onclick = () => {
	todoPage.classList.remove('hidden')
	trackerPage.classList.add('hidden')
}

// Timer Logic
let timerDisplay = document.getElementById('timer')
let startTime, timerInterval
const studyLogs = JSON.parse(localStorage.getItem('studyLogs')) || []

function updateTimer() {
	const elapsed = Date.now() - startTime
	const hours = Math.floor(elapsed / 3600000)
	const mins = Math.floor((elapsed % 3600000) / 60000)
	const secs = Math.floor((elapsed % 60000) / 1000)
	timerDisplay.textContent =
		String(hours).padStart(2, '0') + ":" +
		String(mins).padStart(2, '0') + ":" +
		String(secs).padStart(2, '0')
}

function renderLogs() {
	const list = document.getElementById('studyLogs')
	list.innerHTML = ''
	studyLogs.forEach(log => {
		const li = document.createElement('li')
		li.textContent = `${log.date} — ${log.duration}`
		list.appendChild(li)
	})
}

document.getElementById('startBtn').onclick = () => {
	if (!timerInterval) {
		startTime = Date.now()
		timerInterval = setInterval(updateTimer, 1000)
	}
}

document.getElementById('stopBtn').onclick = () => {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
		const duration = timerDisplay.textContent
		const date = new Date().toLocaleString()
		studyLogs.push({ date, duration })
		localStorage.setItem('studyLogs', JSON.stringify(studyLogs))
		renderLogs()
	}
}

document.getElementById('resetBtn').onclick = () => {
	clearInterval(timerInterval)
	timerInterval = null
	timerDisplay.textContent = "00:00:00"
}

renderLogs()

// Todo Logic
const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
let tasks = JSON.parse(localStorage.getItem('tasks')) || []

function renderTasks() {
	taskList.innerHTML = ''
	tasks.forEach((task, i) => {
		const li = document.createElement('li')
		li.textContent = task
		const delBtn = document.createElement('button')
		delBtn.textContent = "✕"
		delBtn.style.background = "none"
		delBtn.style.border = "none"
		delBtn.style.cursor = "pointer"
		delBtn.onclick = () => {
			tasks.splice(i, 1)
			localStorage.setItem('tasks', JSON.stringify(tasks))
			renderTasks()
		}
		li.appendChild(delBtn)
		taskList.appendChild(li)
	})
}

document.getElementById('addTask').onclick = () => {
	const task = taskInput.value.trim()
	if (task) {
		tasks.push(task)
		localStorage.setItem('tasks', JSON.stringify(tasks))
		renderTasks()
		taskInput.value = ''
	}
}

renderTasks()