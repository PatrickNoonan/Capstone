using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Capstone.Models;
using System.Security.Claims;
using Infrastructure.Data;

namespace Capstone.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        public async Task<IActionResult> AccountRedirect()
        {
            var currentUserId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = _context.Users.Where(u => u.Id == currentUserId).FirstOrDefault();
            
                return RedirectToAction("Create", "Traveler");
            

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
