const delay = ms => new Promise(res => setTimeout(res, ms));
const byteSize = str => new Blob([str]).size;

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

const updateChatHistory = (obj) => {
    let cookieObj = {hist: [...JSON.parse(getCookie("chatHistory")).hist, obj]};

    while(byteSize(JSON.stringify(cookieObj)) > 4000) {
        cookieObj.hist.splice(0, 1);
    }

    setCookie("chatHistory", JSON.stringify(cookieObj));
}

const updateInventory = (obj) => {
    setCookie("inventory", JSON.stringify({inv:[...JSON.parse(getCookie("inventory")).inv, obj]}));
}

const message = (message) => {
    updateChatHistory({message:message, self:false});

    const functionAfter = async ({setChatMessages}) => {
        await delay(500);
        setChatMessages(prev => [...prev, {message:message, self:false}]);
    }
    return [false, [functionAfter]];
};

const goToDialogPath = (path) => {
    setCookie("location", path);
    const functionAfter = async ({setDialogPath}) => {
        setDialogPath(path);
    }
    return [false, [functionAfter]];
};

const giveItem = (item) => {
    updateInventory(item);
    const functionAfter = async ({setInventory}) => {
        setInventory(prev => [...prev, item]);
    }
    return [false, [functionAfter]];
};

const checkInventory = (items, actions) => {
    const inventory = JSON.parse(getCookie("inventory")).inv;
    if (items.every(item => inventory.includes(item))) {
        return [true, executeActions(actions)];
    } else {
        return [false, []];
    }
}

const solvePuzzle = (answer, message, actions) => {
    if(message.trim() === answer) {
        return [false, executeActions(actions.success)];
    } else {
        return [false, executeActions(actions.fail)];
    }
}

const executeActions = (actions, messageInput = null) => {
    let functionsAfter = [];
    for(const action of actions){
        const [breakLoop, functionAfter] = action({messageInput:messageInput});
        functionsAfter = functionsAfter.concat(functionAfter);
        if(breakLoop) break;
    }
    return functionsAfter;
}

export {message, goToDialogPath, giveItem, checkInventory, solvePuzzle, executeActions};