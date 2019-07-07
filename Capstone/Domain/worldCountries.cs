using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain
{
    public class worldCountries
    {
        [Key]
        public int Id { get; set; }
        public string CountryName { get; set; }

        public bool HasVisited { get; set; }

        [ForeignKey("Traveler")]
        public string TravelerId { get; set; }
    }
}
