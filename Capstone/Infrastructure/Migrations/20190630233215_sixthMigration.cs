using Microsoft.EntityFrameworkCore.Migrations;

namespace Infrastructure.Migrations
{
    public partial class sixthMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountriesVisited",
                table: "Travelers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatesVisited",
                table: "Travelers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountriesVisited",
                table: "Travelers");

            migrationBuilder.DropColumn(
                name: "StatesVisited",
                table: "Travelers");
        }
    }
}
