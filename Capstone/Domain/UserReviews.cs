using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain
{
    public class UserReviews
    {
        [Key]
        public int Id { get; set; }
        public string ReviewTitle { get; set; }
        public string Review { get; set; }
        public string Rating { get; set; }
        public string PointOfInterest { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        [ForeignKey("Traveler")]
        public string ReviewerId { get; set; }
    }
}
