using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTobacconistBrandRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BrandId",
                table: "Tobacconists",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tobacconists_BrandId",
                table: "Tobacconists",
                column: "BrandId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tobacconists_Brands_BrandId",
                table: "Tobacconists",
                column: "BrandId",
                principalTable: "Brands",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tobacconists_Brands_BrandId",
                table: "Tobacconists");

            migrationBuilder.DropIndex(
                name: "IX_Tobacconists_BrandId",
                table: "Tobacconists");

            migrationBuilder.DropColumn(
                name: "BrandId",
                table: "Tobacconists");
        }
    }
}
