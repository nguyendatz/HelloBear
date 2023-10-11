using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updatePkForTeacherClassTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_TeacherClass",
                table: "TeacherClass");
            migrationBuilder.DropColumn(name: "Id", table: "TeacherClass");
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "TeacherClass",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<string>(
                name: "TeacherId",
                table: "TeacherClass",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeacherClass",
                table: "TeacherClass",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherClass_ClassId",
                table: "TeacherClass",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherClass_TeacherId",
                table: "TeacherClass",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeacherClass_AspNetUsers_TeacherId",
                table: "TeacherClass",
                column: "TeacherId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeacherClass_AspNetUsers_TeacherId",
                table: "TeacherClass");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TeacherClass",
                table: "TeacherClass");

            migrationBuilder.DropIndex(
                name: "IX_TeacherClass_ClassId",
                table: "TeacherClass");

            migrationBuilder.DropIndex(
                name: "IX_TeacherClass_TeacherId",
                table: "TeacherClass");

            migrationBuilder.AlterColumn<string>(
                name: "TeacherId",
                table: "TeacherClass",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "TeacherClass",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TeacherClass",
                table: "TeacherClass",
                columns: new[] { "ClassId", "TeacherId" });
        }
    }
}
