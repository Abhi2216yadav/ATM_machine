let currentUser = null;
let users = JSON.parse(localStorage.getItem('atmUsers')) || [
    {name: 'Abhay Yadav', pin: '1122', amount: 70000, bankName: 'Bank Of Baroda'},
    {name: 'Ajay Yadav', pin: '1234', amount: 100000, bankName: 'HDFC Bank'}
];

function saveUsers() {
    localStorage.setItem('atmUsers', JSON.stringify(users));
}

function showScreen(screenId) {
    document.querySelectorAll('.screen-content').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function showCreate() {
    showScreen('createScreen');
}

function showLogin() {
    showScreen('loginScreen');
}

function createAccount() {
    const name = document.getElementById('newName').value.trim();
    const bank = document.getElementById('newBank').value.trim();
    const pin = document.getElementById('newPin').value;
    const amount = parseFloat(document.getElementById('newAmount').value) || 0;

    if (!name || !bank || pin.length !== 4 || amount < 0) {
        alert('Please fill all fields correctly: Name, Bank, 4-digit PIN, valid amount.');
        return;
    }

    if (users.find(u => u.name.toLowerCase() === name.toLowerCase())) {
        alert('Account name already exists!');
        return;
    }

    users.push({name, pin, amount, bankName: bank});
    saveUsers();
    alert(`${name}, account created with ₹${amount} in ${bank}!`);
    currentUser = users[users.length - 1];
    showMenu();
}

function login() {
    const name = document.getElementById('loginName').value.trim();
    const pin = document.getElementById('loginPin').value;

    if (!name || pin.length !== 4) {
        document.getElementById('loginStatus').textContent = 'Enter valid name & 4-digit PIN.';
        return;
    }

    currentUser = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.pin === pin);
    if (currentUser) {
        showMenu();
    } else {
        document.getElementById('loginStatus').textContent = 'Wrong name or PIN! Try again.';
    }
}

function showMenu() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('balance').textContent = `Balance: ₹${currentUser.amount.toLocaleString()}`;
    showScreen('menuScreen');
}

function withdraw() {
    document.getElementById('transTitle').textContent = 'Withdraw Money';
    showScreen('transScreen');
}

function deposit() {
    document.getElementById('transTitle').textContent = 'Deposit Money';
    showScreen('transScreen');
}

function checkBalance() {
    document.getElementById('resultMsg').innerHTML = `<strong>${currentUser.bankName} Balance:</strong> ₹${currentUser.amount.toLocaleString()}`;
    showScreen('resultScreen');
}

function performTrans() {
    const amt = parseFloat(document.getElementById('amount').value) || 0;
    const pin = document.getElementById('transPin').value;

    if (pin !== currentUser.pin) {
        document.getElementById('transStatus').textContent = 'Wrong PIN!';
        return;
    }

    if (document.getElementById('transTitle').textContent.includes('Withdraw')) {
        if (amt > currentUser.amount) {
            document.getElementById('transStatus').textContent = 'Insufficient balance!';
            return;
        }
        currentUser.amount -= amt;
        document.getElementById('resultMsg').innerHTML = `${currentUser.bankName} debited by ₹${amt.toLocaleString()}. New balance: ₹${currentUser.amount.toLocaleString()}`;
    } else {
        currentUser.amount += amt;
        document.getElementById('resultMsg').innerHTML = `${currentUser.bankName} credited by ₹${amt.toLocaleString()}. New balance: ₹${currentUser.amount.toLocaleString()}`;
    }

    saveUsers();
    showScreen('resultScreen');
}

function backToMenu() {
    document.getElementById('loginName').value = '';
    document.getElementById('loginPin').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('transPin').value = '';
    document.getElementById('transStatus').textContent = '';
    showMenu();
}
function pinchange() {
    showScreen('pinScreen');   // open new PIN change screen
}

function updatePin() {
    const oldPin = document.getElementById('oldPin').value;
    const newPin = document.getElementById('changeNewPin').value;

    if (oldPin !== currentUser.pin) {
        document.getElementById('pinStatus').textContent = 'Wrong old PIN!';
        return;
    }

    if (newPin.length !== 4) {
        document.getElementById('pinStatus').textContent = 'New PIN must be 4 digits.';
        return;
    }

    currentUser.pin = newPin;
    saveUsers();

    document.getElementById('pinStatus').textContent = 'PIN changed successfully!';
}

let lastTransaction = null;   // store last transaction details

function performTrans() {
    const amt = parseFloat(document.getElementById('amount').value) || 0;
    const pin = document.getElementById('transPin').value;

    if (pin !== currentUser.pin) {
        document.getElementById('transStatus').textContent = 'Wrong PIN!';
        return;
    }

    let type = '';

    if (document.getElementById('transTitle').textContent.includes('Withdraw')) {
        if (amt > currentUser.amount) {
            document.getElementById('transStatus').textContent = 'Insufficient balance!';
            return;
        }
        currentUser.amount -= amt;
        type = 'Withdraw';
    } else {
        currentUser.amount += amt;
        type = 'Deposit';
    }

    // store receipt info
    lastTransaction = {
        name: currentUser.name,
        bank: currentUser.bankName,
        type: type,
        amount: amt,
        balance: currentUser.amount,
        date: new Date().toLocaleString()
    };

    saveUsers();
    showScreen('resultScreen');

    document.getElementById('resultMsg').innerHTML =
        `${type} successful! New balance: ₹${currentUser.amount.toLocaleString()}`;
}
function recipt() {
    if (!lastTransaction) {
        alert("No transaction found!");
        return;
    }

    document.getElementById('resultMsg').innerHTML = `
        <h3>Transaction Receipt</h3>
        <p><strong>Name:</strong> ${lastTransaction.name}</p>
        <p><strong>Bank:</strong> ${lastTransaction.bank}</p>
        <p><strong>Type:</strong> ${lastTransaction.type}</p>
        <p><strong>Amount:</strong> ₹${lastTransaction.amount.toLocaleString()}</p>
        <p><strong>Balance:</strong> ₹${lastTransaction.balance.toLocaleString()}</p>
        <p><strong>Date:</strong> ${lastTransaction.date}</p>
    `;

    showScreen('resultScreen');
}

function logout() {
    currentUser = null;
    showLogin();
}

// Initial load
showCreate();
