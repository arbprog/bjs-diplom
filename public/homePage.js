"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();

function getRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

getRates();
setTimeout(getRates, 1000 * 60);

const moneyManager = new MoneyManager();

function checkСondition(data, response, message) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, message);
    } else {
        moneyManager.setMessage(response.success, response.error);
    }
}

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        const msg = `Пополнение счёта на ${data.amount} ${data.currency}`
        checkСondition(data, response, msg);
    });
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        const msg = `Конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`;
        checkСondition(data, response, msg);
    });
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        const msg = `Перевод ${data.amount} ${data.currency } пользователю ID ${data.to}`;
        checkСondition(data, response, msg);
    });
}

const favoritesWidget = new FavoritesWidget();

function getDataList(response) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}

ApiConnector.getFavorites(response => {
    if (response.success) {
        getDataList(response);
    }
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            getDataList(response);
            moneyManager.setMessage(response.success, `${data.name} добавлен`);
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            getDataList(response);
            moneyManager.setMessage(response.success, `ID ${data} удален`);
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    });
}