"use strict";

const userForm = new UserForm();

userForm.loginFormCallback = function (data) {
    ApiConnector.login(data, response => {
        console.log(response);

        if (response.succes) {
            return location.reload();
        } else {
            return userForm.setLoginErrorMessage(response.error);
        }
    });
};

userForm.registerFormCallback = function (data) {
    ApiConnector.login(data, response => {
        console.log(response);

        if (response.success) {
            return location.reload();
        } else {
            return userForm.setRegisterErrorMessage(response.error);
        }
    });
};