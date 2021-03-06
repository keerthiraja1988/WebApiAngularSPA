﻿namespace WebAppMVC.Areas.Dashboard.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [AutoValidateAntiforgeryToken]
    [Area("Dashboard")]
    [Authorize]
    public class DashboardController : Controller
    {
        [Route("")]
        [Route("Home")]
        [HttpGet]
        public IActionResult Index()
        {
            return this.View();
        }
    }
}