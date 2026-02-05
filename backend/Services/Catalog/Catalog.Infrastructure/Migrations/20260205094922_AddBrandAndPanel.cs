using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandAndPanel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Country = table.Column<string>(type: "text", nullable: true),
                    LogoUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Panels",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    TobacconistCode = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    BrandId = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Origin = table.Column<string>(type: "text", nullable: true),
                    Strength = table.Column<int>(type: "integer", nullable: true),
                    Wrapper = table.Column<string>(type: "text", nullable: true),
                    WrapperColor = table.Column<int>(type: "integer", nullable: true),
                    Binder = table.Column<string>(type: "text", nullable: true),
                    Filler = table.Column<string>(type: "text", nullable: true),
                    MasterLine = table.Column<string>(type: "text", nullable: true),
                    RollingType = table.Column<string>(type: "text", nullable: true),
                    Shape = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric", nullable: true),
                    Rating = table.Column<decimal>(type: "numeric", nullable: true),
                    NumberInBox = table.Column<int>(type: "integer", nullable: true),
                    Ring = table.Column<int>(type: "integer", nullable: true),
                    SmokingTime = table.Column<int>(type: "integer", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: true),
                    TobacconistId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Panels", x => x.id);
                    table.ForeignKey(
                        name: "FK_Panels_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Panels_Tobacconists_TobacconistId",
                        column: x => x.TobacconistId,
                        principalTable: "Tobacconists",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Panels_BrandId",
                table: "Panels",
                column: "BrandId");

            migrationBuilder.CreateIndex(
                name: "IX_Panels_TobacconistId",
                table: "Panels",
                column: "TobacconistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Panels");

            migrationBuilder.DropTable(
                name: "Brands");
        }
    }
}
