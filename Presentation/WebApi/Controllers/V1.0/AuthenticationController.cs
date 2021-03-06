﻿namespace WebApi.Controllers.V1._0
{
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Net;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using BindingModelSPA;
    using BindingModelSPA.User;
    using CrossCutting.ConfigCache;
    using CrossCutting.Constants;
    using Domain.User;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using ServiceInterface;
    using WebApi.Infrastructure.Filters;
    using WebApi.Models.V1._0;

    using static WebApi.Startup;

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiVersion("1.0")]
    [Route("api/v{ver:apiVersion}/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAuthenticationService _authenticationService;

        private readonly IOptions<JwtAuthentication> _jwtAuthentication;

        public AuthenticationController(ILogger<AuthenticationController> logger,
                                IMapper mapper,
                                IHttpContextAccessor httpContextAccessor,
                                IOptions<JwtAuthentication> jwtAuthentication,
                                IAuthenticationService authenticationService)
        {
            this._httpContextAccessor = httpContextAccessor;
            this._logger = logger;
            this._mapper = mapper;
            this._jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));

            this._authenticationService = authenticationService;
        }

        [HttpPost("User/AuthenticateUser")]
        [AllowAnonymous]
        [ValidateModelState]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)] //For bad request
        [ProducesResponseType(500)] //If there was an internal server error
        public async Task<IActionResult> AuthenticateUserAsync([FromBody] UserLoginBindingModel userLoginBindingModel)
        {
            var response = new SingleResponse<dynamic>();

            var user = this._mapper.Map<User>(userLoginBindingModel);

            var userAuthenticationDetails = await this._authenticationService.AuthenticateUserAsync(user);
            var userAuthentication = userAuthenticationDetails.Item2;
            var userDetails = userAuthenticationDetails.Item1;

            UserAuthenticationBindingModel userAuthenticationBindingModel = new UserAuthenticationBindingModel();
            userAuthenticationBindingModel = this._mapper.Map<UserAuthenticationBindingModel>(userAuthentication);
            userAuthenticationBindingModel.UserName = userLoginBindingModel.UserName;
            if (userAuthenticationBindingModel.IsUserAuthenticated)
            {
                response.Message = "User " + userAuthentication.UserName
                + " authenticated successfully. Redirecting to Home screen.";
                this.CreateJWTToken(response, userAuthenticationBindingModel);
            }
            else
            {
                response.Model = userAuthenticationBindingModel;
                response.DidValidationError = true;
                response.Message = "User Name or Password is Incorrect. Please try again";
            }

            return response.ToHttpResponse();
        }

        [HttpPost("User/RegisterUser")]
        [ValidateModelState]
        [AllowAnonymous]
        [ProducesResponseType(200)]
        [ProducesResponseType(201)] //A response as creation of user
        [ProducesResponseType(400)] //For bad request
        [ProducesResponseType(500)] //If there was an internal server error
        public async Task<IActionResult> RegisterUserAsync([FromBody]RegisterUserBindingModel userBindingModel)
        {
            var errors = new Dictionary<string, string>();
            var response = new SingleCreatedResponse<dynamic>();

            User user = await this._authenticationService.GetUserDetailsByUserNameAsync(userBindingModel.UserName);

            if (user != null)
            {
                errors.Add("UserName", "User Name " + userBindingModel.UserName + " already exists");
                response.ErrorMessage = "Validation error occured";
                response.DidValidationError = true;
                response.Model = errors;
                return response.ToHttpResponse();
            }

            user = this._mapper.Map<User>(userBindingModel);

            var userCreationSuccess = await this._authenticationService.RegisterUserAsync(user);

            if (userCreationSuccess > 0)
            {
                UserAuthenticationBindingModel userAuthentication = new UserAuthenticationBindingModel();

                userAuthentication.UserName = userBindingModel.UserName;

                response.Message = "User " + userAuthentication.UserName
                + " created successfully. Redirecting to Home screen.";
                this.CreateJWTToken(response, userAuthentication);
            }

            return response.ToHttpResponse();
        }

        [HttpGet("User/CheckAuthentication")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)] //For bad request
        [ProducesResponseType(500)] //If there was an internal server error
        public async Task<IActionResult> CheckAuthenticationAsync()
        {
            return await Task.Run(() => this.Ok());
        }

        private void CreateJWTToken(dynamic response, UserAuthenticationBindingModel userAuthentication)
        {
            userAuthentication.ExpiresOn = DateTime.Now.AddDays(1);
            userAuthentication.LoggedOn = DateTime.Now;
            userAuthentication.IsUserAuthenticated = true;
            userAuthentication.IsUserAccountFound = true;

            var token = new JwtSecurityToken(
                issuer: GlobalAppConfigurations.Instance.GetValue("ValidIssuer").ToString(),
                audience: GlobalAppConfigurations.Instance.GetValue("ValidAudience").ToString(),
                claims: new[]
                {
                // You can add more claims if you want
                new Claim(JwtRegisteredClaimNames.Sub, userAuthentication.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                 new Claim(ClaimTypes.Role, CoreWebApiRoles.Admin)
                },
                expires: userAuthentication.ExpiresOn,
                notBefore: userAuthentication.LoggedOn,
                signingCredentials: this._jwtAuthentication.Value.SigningCredentials);

            userAuthentication.Token = new JwtSecurityTokenHandler().WriteToken(token);

            response.Model = userAuthentication;
        }
    }
}