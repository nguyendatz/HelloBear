using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOriginalDimensionToPushAndListen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OriginalHeight",
                table: "PushAndListen",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OriginalWidth",
                table: "PushAndListen",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalHeight",
                table: "PushAndListen");

            migrationBuilder.DropColumn(
                name: "OriginalWidth",
                table: "PushAndListen");
        }
    }
}
