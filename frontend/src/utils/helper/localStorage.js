//store to local storage
function setLocalStorage (key, value) {
    if(typeof value === "object") {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
}

//get value from local storage
function getLocalStorage (key) {
    let value = localStorage.getItem(key)
    try {
        value = JSON.stringify(value)
    } catch (error) {
        value = value
    }
    return value
}

//delete data from local storage
function clearStorage() {
    localStorage.clear()
}

export {setLocalStorage, getLocalStorage, clearStorage}