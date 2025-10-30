const taskInput = document.getElementById('taskInput')
const taskList = document.getElementById('taskList')
// load tasks and migrate old items to object shape { id, text, done }
let tasks = JSON.parse(localStorage.getItem('tasks')) || []
if (!Array.isArray(tasks)) tasks = []
// ensure every task has id and normalized shape
tasks = tasks.map((t, idx) => {
	if (typeof t === 'string') return { id: Date.now() + idx, text: t, done: false }
	if (!t || typeof t !== 'object') return { id: Date.now() + idx, text: String(t), done: false }
	if (!('id' in t)) t.id = Date.now() + idx
	if (!('text' in t)) t.text = String(t.text || '')
	if (!('done' in t)) t.done = !!t.done
	return t
})

// transient map of pending removal timers keyed by task id
const removalTimers = new Map()

function scheduleRemoval(taskId, li) {
	// mark the task as pending removal so re-render shows visual hint
	const idx = tasks.findIndex(x => x.id === taskId)
	if (idx === -1) return
	tasks[idx].pendingRemoval = true
	// set timeout to remove after 3s
	const t = setTimeout(() => {
		// find by id and remove
		const j = tasks.findIndex(x => x.id === taskId)
		if (j !== -1) {
			tasks.splice(j, 1)
			localStorage.setItem('tasks', JSON.stringify(tasks))
		}
		removalTimers.delete(taskId)
		renderTasks()
	}, 3000)
	removalTimers.set(taskId, t)
}

function cancelRemoval(taskId, li) {
	const idx = tasks.findIndex(x => x.id === taskId)
	if (idx !== -1) tasks[idx].pendingRemoval = false
	const t = removalTimers.get(taskId)
	if (t) {
		clearTimeout(t)
		removalTimers.delete(taskId)
	}
}

function renderTasks() {
	taskList.innerHTML = ''
	tasks.forEach((task) => {
		const li = document.createElement('li')
		li.dataset.id = task.id

		const left = document.createElement('div')
		left.className = 'task-left'

		const checkbox = document.createElement('input')
		checkbox.type = 'checkbox'
		checkbox.checked = !!task.done

		const span = document.createElement('span')
		span.textContent = task.text
		if (task.done) span.classList.add('completed')

		checkbox.onchange = () => {
			// update model
			const idx = tasks.findIndex(x => x.id === task.id)
			if (idx === -1) return
			tasks[idx].done = checkbox.checked
			// clear any previous pendingRemoval when unchecked
			if (!checkbox.checked) tasks[idx].pendingRemoval = false
			localStorage.setItem('tasks', JSON.stringify(tasks))

			if (checkbox.checked) {
				// schedule removal in 3s
				scheduleRemoval(task.id)
			} else {
				// cancel pending removal if any
				cancelRemoval(task.id)
			}

			renderTasks()
		}

		left.appendChild(checkbox)
		left.appendChild(span)

		// add visual removal class if pending
		if (task.pendingRemoval) li.classList.add('will-remove')

		li.appendChild(left)
		taskList.appendChild(li)
	})
}

document.getElementById('addTask').onclick = () => {
	const taskText = taskInput.value.trim()
	if (taskText) {
		const newTask = { id: Date.now() + Math.random(), text: taskText, done: false }
		tasks.push(newTask)
		localStorage.setItem('tasks', JSON.stringify(tasks))
		renderTasks()
		taskInput.value = ''
	}
}

renderTasks()