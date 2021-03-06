﻿(
    function (publicMethod, $) {
        publicMethod.showSweetAlertMessagePopUp = function (title, message) {
            swalWithBootstrapButtons.fire({
                title: title,
                text: message,
                type: 'success',
                allowOutsideClick: false,
                showCancelButton: false,
                confirmButtonText: '<i class="fas fa-check"></i> Ok'
            }).then((result) => {
                if (result.value) {
                }
            });
        }

        publicMethod.showAjaxErrorMessagePopUp = function (xMLHttpRequest, textStatus, errorThrown) {
            if (xMLHttpRequest.status == "403") {
                swalWithBootstrapButtons.fire({
                    title: 'Access Denied!',

                    type: 'warning',
                    html: '<br> Your request has been denied due to in-sufficient access. <br> <br>' +
                        '<div style="text-align: center; font-size : 14px;" >   Error Message: ' + xMLHttpRequest.status + " " + errorThrown +
                        '<br> <br> ' + ' Request Id : ' + xMLHttpRequest.getResponseHeader('RequestId') + ' </div>',
                    showCancelButton: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    cancelButtonText: '<i class="fas fa-times"></i> Close'
                });
            }
            else {
                swalWithBootstrapButtons.fire({
                    title: 'Oops...',

                    type: 'error',
                    html: '<br> An error occurred while processing your request. <br> <br>' +
                        '<div style="text-align: center; font-size : 14px;" >   Error Message: ' + xMLHttpRequest.status + " " + errorThrown +
                        '<br> <br> ' + ' Request Id : ' + xMLHttpRequest.getResponseHeader('RequestId') + ' </div>',
                    showCancelButton: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    cancelButtonText: '<i class="fas fa-times"></i> Close'
                });
            }
        }

        publicMethod.showErrorMessagePopUp = function (message, requestId) {
            swalWithBootstrapButtons.fire({
                title: 'Oops...',
                text: message,
                type: 'error',
                html: '<br> <br> ' +
                    '<div style="text-align: center; font-size : 16px;" >   Error Message: ' + message +
                    '<br> <br> ' + ' Request Id : ' + requestId + ' </div>',
                showCancelButton: true,
                showConfirmButton: false,
                allowOutsideClick: false,
                cancelButtonText: '<i class="fas fa-times"></i> Close'
            });
        },

            publicMethod.showWarningMessagePopUp = function (message) {
                swalWithBootstrapButtons.fire({
                    title: 'Warning',
                    html: '<br>' +
                        '<div style="text-align: center; font-size : 16px;" > ' + message + ' </div>',
                    type: 'warning',
                    showCancelButton: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    cancelButtonText: '<i class="fas fa-times"></i> Close'
                });
            },

            publicMethod.removeNavBarLogin = function () {
                $("#navBarLogin").remove();
            },

            publicMethod.removeNavbarAuthenticated = function () {
                $("#navbarAuthenticated").remove();
            },

            publicMethod.ShowLoadingIndicator = function () {
                document.getElementById("processingOverlay").style.height = "100%";
            },

            publicMethod.HideLoadingIndicator = function () {
                setTimeout(
                    function () {
                        document.getElementById("processingOverlay").style.height = "0%";
                    }, 500);
            },

            publicMethod.updateProgressBar = function (percentage) {
                var delay = 40;

                $("#progressBar")
                    .attr("aria-valuenow", percentage);

                $("#progressBar")
                    .css("width", percentage + "%")

                $("#progressBar").prop('Counter', percentage).animate({
                    Counter: percentage
                }, {
                        duration: delay,
                        step: function (now) {
                            $(this).text(Math.ceil(now) + '%');
                            $('#progressCompleted').text(Math.ceil(now) + '% Completed');
                        }
                    });

                document.getElementById("progressBarDiv").style.height = "100%";
            },

            publicMethod.showProgressbar = function () {
                $("#progressBar")
                    .attr("aria-valuenow", 0);

                $("#progressBar")
                    .css("width", 0 + "%")

                document.getElementById("progressBarDiv").style.height = "100%";
            },

            publicMethod.hideProgressbar = function () {
                setTimeout(
                    function () {
                        $("#progressBar")
                            .attr("aria-valuenow", 0);

                        $("#progressBar")
                            .css("width", 0 + "%")
                    }, 1000);

                setTimeout(
                    function () {
                        document.getElementById("progressBarDiv").style.height = "0%";
                    }, 300);
            },

            publicMethod.RedirectToHomePage = function () {
                homeController.ShowLoadingIndicator();
                var url = "\Home";
                window.location.href = url;
            },

            publicMethod.RedirectToUrl = function (url) {
                homeController.ShowLoadingIndicator();
                window.location.href = url;
            },

            publicMethod.reloadCurrentPage = function () {
                homeController.ShowLoadingIndicator();
                location.reload();
            },

            publicMethod.loadScriptFile = function (scriptPath) {
                $.getScript(scriptPath);
            }

        publicMethod.showModalPopUp = function (modalName) {
            $('#' + modalName).modal('show');
        }

        publicMethod.HideModalPopUp = function (modalName) {
            $('#' + modalName).modal('hide');
        }

        publicMethod.showProfileTab = function () {
            $("#tabRoles").removeClass("active");
            $("#roles").removeClass("active show");

            $("#tabProfile").addClass("active");
            $("#profile").addClass("active show");
        }

        publicMethod.showRolesTab = function () {
            $("#tabProfile").removeClass("active");
            $("#profile").removeClass("active show");

            $("#tabRoles").addClass("active");
            $("#roles").addClass("active show");
        }

        publicMethod.navActiveColorChange = function (navBarId) {
            $('[id^="nav-Item"]').css("background-color", "rgba(53, 35, 35, 0)");

            setTimeout(
                function () {
                    $("#" + navBarId).css("background-color", "rgba(53, 35, 35, 0.25)");
                }, 200);
        }
    }(window.homeController = window.homeController || {}, jQuery)
);