const loginSteamButton = document.getElementById('loginSteam')
const refreshAccButton = document.getElementById('refreshAccounts')

const source = $('#template').html()
refreshAccounts()

refreshAccButton.addEventListener('click', async () => {
	console.log('refreshed')
	refreshAccounts()
})

async function refreshAccounts () {
	const html = await fetchAccounts();
	$('#accountsData').empty().append(html);
	await setupProfileButtons();
}

async function fetchAccounts () {
	return fetch('/getCurrentAccounts', {
		method: 'GET',
		headers: { 'Content-Type': 'text/html' }
	})
	.then(response => response.text())
	.then(data => {
		return data
	})
	.catch(error => {
		console.error('Error fetching accounts: ', error)
	})
}

async function fetchAccountDetails(configName){
	return fetch('/puppeteer/getAccountDetails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message: `${configName}` })
	})
	.then(response => response.json())
	.then(data => {
		if (data.status === 'success') {
			console.log(data.message)
		}
	})
	.catch(error => console.error(JSON.parse(error)))
}

loginSteamButton.addEventListener('click', () => {
	const loadingSpinner = document.getElementById('loadingSpinner')
	const configName = document.getElementById('configInput').value
	// loadingSpinner.classList.add("d-block");
	// loadingSpinner.classList.remove("d-none");
	addAccount(configName)
})

function addAccount (configName) {
	setStatus('')
	fetch('/puppeteer/addAccount', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message: `${configName}` })
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				console.log(data.message)
				checkAccount(configName)
			} else {
				setStatus(data.message)
			}
		})
		.catch(error => console.error(JSON.parse(error)))
}

function checkAccount (configName) {
	toggleSpinner()
	fetch('/puppeteer/checkAccount', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message: `${configName}` })
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'success') {
				console.log(data.message)
			}
			toggleSpinner()
			setStatus(data.message)
			refreshAccounts()
		})
		.catch(error => console.error(JSON.parse(error)))
}

function deleteAccount(configName) {
	fetch('/puppeteer/deleteAccount', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message: `${configName}` })
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === 'error') {
				console.log(data.message)
			}

			refreshAccounts()
		})
		.catch(error => console.error(JSON.parse(error)))
}

function checkInput () {
	const folderNameRegex = /^[^\\\/:\*\?\"<>\|]+$/
	const inputField = document.getElementById('configInput')
	const submitButton = document.getElementById('loginSteam')
	if (inputField.value.trim().length > 0 && folderNameRegex.test(inputField.value)) {
		submitButton.disabled = false
	} else {
		submitButton.disabled = true
	}
}

function toggleSpinner () {
	const spinner = document.getElementById('loadingSpinner')
	spinner.classList.toggle('invisible')
}

function setStatus (text) {
	const status = document.getElementById('status')
	status.innerHTML = text
}

async function setupProfileButtons(){
	let profiles = document.querySelectorAll('[data-configname]');
	profiles.forEach( (element) => {
		let profileName = element.getAttribute('data-configname');
		let playButton = element.querySelectorAll('.accountPlay')[0];
		let optionsButton = element.querySelectorAll('.accountOptions')[0];
		let deleteButton = element.querySelectorAll('.accountDelete')[0];

		playButton.onclick = function() {
			playFunction(profileName);
		};
		optionsButton.onclick = function() {
			optionsFunction(profileName);
		};
		deleteButton.onclick = function() {
			deleteFunction(profileName);
		};
	});
}


// Define the playFunction to perform the desired action
function playFunction(configName) {
    console.log('Playing with configName:', configName);
	const html = fetchAccountDetails(configName);
	$('.accountDetails').empty().append(html);
    
}

function optionsFunction(configName){
	console.log('Options with configName:', configName);
}

function deleteFunction(configName){
	console.log('delete with configName:', configName);
	deleteAccount(configName);
}


