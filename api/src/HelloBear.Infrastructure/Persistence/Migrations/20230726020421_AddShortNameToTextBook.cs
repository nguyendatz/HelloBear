using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddShortNameToTextBook : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM TextBooks");
            migrationBuilder.AddColumn<string>(
                name: "ShortName",
                table: "TextBooks",
                type: "nvarchar(2)",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TextBooks_ShortName",
                table: "TextBooks",
                column: "ShortName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TextBooks_ShortName",
                table: "TextBooks");

            migrationBuilder.DropColumn(
                name: "ShortName",
                table: "TextBooks");
        }
    }
}
