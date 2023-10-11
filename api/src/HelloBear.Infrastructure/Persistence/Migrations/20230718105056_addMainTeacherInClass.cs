using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addMainTeacherInClass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeacherClass_AspNetUsers_TeacherId",
                table: "TeacherClass");

            migrationBuilder.DropIndex(
                name: "IX_TeacherClass_TeacherId",
                table: "TeacherClass");

            migrationBuilder.AddColumn<string>(
                name: "MainTeacherId",
                table: "Classes",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_MainTeacherId",
                table: "Classes",
                column: "MainTeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_Classes_AspNetUsers_MainTeacherId",
                table: "Classes",
                column: "MainTeacherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Classes_AspNetUsers_MainTeacherId",
                table: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Classes_MainTeacherId",
                table: "Classes");

            migrationBuilder.DropColumn(
                name: "MainTeacherId",
                table: "Classes");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherClass_TeacherId",
                table: "TeacherClass",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherClass_AspNetUsers_TeacherId",
                table: "TeacherClass",
                column: "TeacherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
