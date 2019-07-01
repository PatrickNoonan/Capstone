using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class eightMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateVisited",
                table: "TravelDetails",
                newName: "YearVisited");

            migrationBuilder.AddColumn<string>(
                name: "MonthVisited",
                table: "TravelDetails",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MonthVisited",
                table: "TravelDetails");

            migrationBuilder.RenameColumn(
                name: "YearVisited",
                table: "TravelDetails",
                newName: "DateVisited");
        }
    }
}
