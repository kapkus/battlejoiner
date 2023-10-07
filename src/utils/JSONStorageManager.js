import fs from 'fs'

export default class JSONStorageManager {
	constructor (file_path) {
		this.file_path = file_path
		this.data = this._loadData()
	}

	_loadData () {
		try {
			const jsonData = fs.readFileSync(this.file_path)
			return JSON.parse(jsonData)
		} catch (error) {
			console.error(`Error reading file: ${error}`)
			this._createFile()
			return {}
		}
	}

	_createFile () {
		try {
			fs.writeFileSync(this.file_path, '{}')
			console.log(`Created file: ${this.file_path}`)
		} catch (error) {
			console.error(`Error creating file: ${error}`)
		}
	}

	_saveData () {
		try {
			fs.writeFileSync(this.file_path, JSON.stringify(this.data, null, 2))
		} catch (error) {
			console.error(`Error writing file: ${error}`)
		}
	}

	addEntry (user, key, value) {
		if (!this.data[user]) {
			this.data[user] = {}
		}
		this.data[user][key] = value
		this._saveData()
	}

	deleteUser(user){
		if(this.data[user]) {
			delete this.data[user];
			this._saveData();
		}else{
			console.error(`User '${user}' does not exist.`)
		}
	}

	deleteEntry (user, key) {
		if (this.data[user]) {
			delete this.data[user][key]
			this._saveData()
		} else {
			console.error(`User '${user}' does not exist.`)
		}
	}

	updateEntry (user, key, newValue) {
		if (this.data.hasOwnProperty(user) && this.data[user].hasOwnProperty(key)) {
			this.data[user][key] = newValue
			this._saveData()
		} else {
			console.error(`User '${user}' or property '${key}' does not exist.`)
		}
	}

	getEntry (user, key) {
		return this.data[user] ? this.data[user][key] : undefined
	}

	getUserConfig (user) {
		return this.data[user] || {}
	}

	getAllEntries () {
		return this.data
	}
}
