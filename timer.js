let timerDisplay = document.getElementById('timer')
let startTime, timerInterval
const studyLogs = JSON.parse(localStorage.getItem('studyLogs')) || []
// topic input for current study session
const topicInput = document.getElementById('topicInput')
// reset button element (only shown while timer is running)
const resetBtn = document.getElementById('resetBtn')
// hide reset by default
if (resetBtn) resetBtn.classList.add('hidden')
// start button element (we'll hide while running)
const startBtn = document.getElementById('startBtn')

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
		// layout: topic left, duration right
		li.className = 'study-log'

		const topicSpan = document.createElement('span')
		topicSpan.className = 'log-topic'
		topicSpan.textContent = log.topic || 'General'

		const durSpan = document.createElement('span')
		durSpan.className = 'log-duration'
		durSpan.textContent = log.duration

		li.appendChild(topicSpan)
		li.appendChild(durSpan)
		list.appendChild(li)
	})
}

document.getElementById('startBtn').onclick = () => {
	if (!timerInterval) {
		startTime = Date.now()
		timerInterval = setInterval(updateTimer, 1000)
	}
	// show reset while timer is running
	if (resetBtn) resetBtn.classList.remove('hidden')
	// hide start while running
	if (startBtn) startBtn.classList.add('hidden')
}

document.getElementById('stopBtn').onclick = () => {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
		const duration = timerDisplay.textContent
		const date = new Date().toLocaleString()
		const topic = topicInput ? topicInput.value.trim() : ''
		studyLogs.push({ date, duration, topic })
		localStorage.setItem('studyLogs', JSON.stringify(studyLogs))
		renderLogs()
	}
	// hide reset when timer stopped
	if (resetBtn) resetBtn.classList.add('hidden')
	// show start when stopped
	if (startBtn) startBtn.classList.remove('hidden')
}

document.getElementById('resetBtn').onclick = () => {
	clearInterval(timerInterval)
	timerInterval = null
	timerDisplay.textContent = "00:00:00"
	// hide reset after resetting timer
	if (resetBtn) resetBtn.classList.add('hidden')
	// show start after reset
	if (startBtn) startBtn.classList.remove('hidden')
}

renderLogs()