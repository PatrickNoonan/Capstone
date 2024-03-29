﻿using System;
using System.Collections.Generic;
using System.Text;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public DbSet<Traveler> Travelers { get; set; }
        public DbSet<UserReviews> UserReviews { get; set; }
        public DbSet<TravelDetails> TravelDetails { get; set; }
        public DbSet<ApplicationRole> Role { get; set; }
        public DbSet<usStates> usStates { get; set; }
        public DbSet<worldCountries> worldCountries { get; set; }
        public DbSet<FuturePlaces> FuturePlaces { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
