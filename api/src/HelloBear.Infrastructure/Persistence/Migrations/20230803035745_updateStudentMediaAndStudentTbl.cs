using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updateStudentMediaAndStudentTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentClass_Student_StudentId",
                table: "StudentClass");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentMedia_Student_StudentId",
                table: "StudentMedia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentMedia",
                table: "StudentMedia");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Student",
                table: "Student");

            migrationBuilder.RenameTable(
                name: "StudentMedia",
                newName: "StudentMedias");

            migrationBuilder.RenameTable(
                name: "Student",
                newName: "Students");

            migrationBuilder.RenameIndex(
                name: "IX_StudentMedia_StudentId",
                table: "StudentMedias",
                newName: "IX_StudentMedias_StudentId");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "StudentMedias",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "StudentMedias",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentMedias",
                table: "StudentMedias",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Students",
                table: "Students",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentClass_Students_StudentId",
                table: "StudentClass",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentMedias_Students_StudentId",
                table: "StudentMedias",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentClass_Students_StudentId",
                table: "StudentClass");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentMedias_Students_StudentId",
                table: "StudentMedias");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Students",
                table: "Students");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentMedias",
                table: "StudentMedias");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "StudentMedias");

            migrationBuilder.RenameTable(
                name: "Students",
                newName: "Student");

            migrationBuilder.RenameTable(
                name: "StudentMedias",
                newName: "StudentMedia");

            migrationBuilder.RenameIndex(
                name: "IX_StudentMedias_StudentId",
                table: "StudentMedia",
                newName: "IX_StudentMedia_StudentId");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "StudentMedia",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Student",
                table: "Student",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentMedia",
                table: "StudentMedia",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentClass_Student_StudentId",
                table: "StudentClass",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentMedia_Student_StudentId",
                table: "StudentMedia",
                column: "StudentId",
                principalTable: "Student",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
