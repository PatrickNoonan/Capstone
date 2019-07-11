using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain
{
    public class FuturePlaces
    {
        [Key]
        public int Id { get; set; }
        public string placeName { get; set; }
        public string countryName { get; set; }
        public string notes { get; set; }
        public string photoUrl { get; set; }

        [ForeignKey("Traveler")]
        public string TravelerId { get; set; }
    }
}
