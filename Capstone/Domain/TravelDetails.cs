using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Domain
{
    public class TravelDetails
    {
        [Key]
        public int Id { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string MonthVisited { get; set; }
        public string YearVisited { get; set; }
        [NotMapped]
        public string YearMonthVisited { get; set; }
        public string PhotoUrl { get; set; }
        public string Notes { get; set; }

        [ForeignKey("Traveler")]
        public string TravelersId { get; set; }
    }
}
