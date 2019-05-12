﻿(
    function (publicMethod, $) {
        publicMethod.registerUserOnBegin = function (xhr, data) {
        }

        publicMethod.registerUserOnComplete = function (xhr, data) {
        }

        publicMethod.registerUserOnSuccess = function (data, status, xhr) {
            if (jQuery.type(data.Status) === "undefined") {
            }

            else {
                swalWithBootstrapButtons.fire({
                    title: data.GetGoodJobVerb,
                    text: data.Message,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: '<i class="fas fa-home"></i> Go to Home'
                }).then((result) => {
                    if (result.value) {
                        homeController.RedirectToHomePage();
                    }
                });
            }
        }

        publicMethod.registerUserOnfailure = function (xMLHttpRequest, textStatus, errorThrown) {
        }

        publicMethod.loginUserOnBegin = function (xhr, data) {
            homeController.ShowLoaddingIndicator();
        }

        publicMethod.loginUserOnComplete = function (xhr, data) {
            homeController.HideLoaddingIndicator();
        }

        publicMethod.loginUserOnSuccess = function (data, status, xhr) {
            if (data.Status === "undefined") {
            }
            if (data.Status === "Success") {
                homeController.RedirectToHomePage();
            }
            else if (data.Status === "Warning") {
                swalWithBootstrapButtons.fire({
                    title: 'Sorry...',
                    text: data.Message,
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: '<i class="fas fa-check"></i> Ok'
                });
            }
            else {
            }
        }

        publicMethod.loginUserOnfailure = function (xMLHttpRequest, textStatus, errorThrown) {
        }
    }(window.authController = window.authController || {}, jQuery)
);