using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTobacconistPanelOneToOneRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels",
                column: "TobacconistId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels",
                column: "TobacconistId");
        }
    }
}
