using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Domain;
using System.Security.Claims;

namespace Capstone.Controllers
{
    public class TravelersController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TravelersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Travelers
        public async Task<IActionResult> Index()
        {
            var loggedInMember = GetLoggedInMember();
            if (loggedInMember == null)
            {
                return RedirectToAction(nameof(Create));
            }
            else
            {
                return View(loggedInMember);
            }

            //return View(await _context.Businesses.ToListAsync());
        }

        // GET: Travelers/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var traveler = await _context.Travelers
                .Include(t => t.ApplicationUser)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (traveler == null)
            {
                return NotFound();
            }

            return View(traveler);
        }

        // GET: Travelers/Create
        public IActionResult Create()
        {
            ViewData["ApplicationId"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        // POST: Travelers/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,FirstName,LastName,Street,City,State,Zip,Country,ApplicationId,UserRole")] Traveler traveler)
        {
            if (ModelState.IsValid)
            {
                _context.Add(traveler);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["ApplicationId"] = new SelectList(_context.Users, "Id", "Id", traveler.ApplicationId);
            return View(traveler);
        }

        // GET: Travelers/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var traveler = await _context.Travelers.FindAsync(id);
            if (traveler == null)
            {
                return NotFound();
            }
            ViewData["ApplicationId"] = new SelectList(_context.Users, "Id", "Id", traveler.ApplicationId);
            return View(traveler);
        }

        // POST: Travelers/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,FirstName,LastName,Street,City,State,Zip,Country,ApplicationId,UserRole")] Traveler traveler)
        {
            if (id != traveler.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(traveler);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TravelerExists(traveler.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["ApplicationId"] = new SelectList(_context.Users, "Id", "Id", traveler.ApplicationId);
            return View(traveler);
        }

        // GET: Travelers/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var traveler = await _context.Travelers
                .Include(t => t.ApplicationUser)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (traveler == null)
            {
                return NotFound();
            }

            return View(traveler);
        }

        // POST: Travelers/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var traveler = await _context.Travelers.FindAsync(id);
            _context.Travelers.Remove(traveler);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        public IActionResult ProfilePage()
        {
            ViewData["Message"] = "Your Profile Page";

            return View();
        }
        public IActionResult WorldMap()
        {
            ViewData["Message"] = "Your World Map";

            return View();
        }

        public IActionResult VisionBoard()
        {
            ViewData["Message"] = "Your Vision Board";

            return View();
        }

        private bool TravelerExists(int id)
        {
            return _context.Travelers.Any(e => e.Id == id);
        }

        public Traveler GetLoggedInMember()
        {
            var currentUserId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var loggedInMember = _context.Travelers.SingleOrDefault(b => b.ApplicationId == currentUserId);
            return loggedInMember;
        }

        [HttpPost]
        public async Task<IActionResult> PostReview([FromBody]UserReviews newReview)
        {
            var loggedInMember = GetLoggedInMember();
            newReview.ReviewerId = loggedInMember.FirstName + " " + loggedInMember.LastName;
            _context.UserReviews.Add(newReview);
            _context.SaveChanges();

            return Ok();
        }
        [HttpPost]
        public async Task<IActionResult> PostTravelDetails([FromBody]TravelDetails newTrip)
        {
            var loggedInMember = GetLoggedInMember();
            newTrip.TravelersId = loggedInMember.FirstName + " " + loggedInMember.LastName;
            _context.TravelDetails.Add(newTrip);
            _context.SaveChanges();

            return Ok();
        }
        [HttpGet]
        public async Task<IActionResult> GetTravelDetails()
        {
            List<TravelDetails> data = new List<TravelDetails>();
            Traveler currentTraveler = GetLoggedInMember();
            data = _context.TravelDetails
                .Where(c => c.TravelersId == (currentTraveler.FirstName + " " + currentTraveler.LastName))
                .ToList();

            data.ForEach(c => c.YearMonthVisited = c.YearVisited + c.MonthVisited);

            return Json(data);
        }
    }
}
