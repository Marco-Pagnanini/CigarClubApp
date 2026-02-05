using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovePanelTobacconistNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Panels_Tobacconists_TobacconistId",
                table: "Panels");

            migrationBuilder.DropIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels",
                column: "TobacconistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Panels_Tobacconists_TobacconistId",
                table: "Panels",
                column: "TobacconistId",
                principalTable: "Tobacconists",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
