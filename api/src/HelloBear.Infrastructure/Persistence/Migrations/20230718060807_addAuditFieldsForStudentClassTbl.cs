using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class addAuditFieldsForStudentClassTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "StudentClass",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "StudentClass",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "StudentClass",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "StudentClass",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedDate",
                table: "StudentClass",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "StudentClass");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "StudentClass");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "StudentClass");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "StudentClass");

            migrationBuilder.DropColumn(
                name: "ModifiedDate",
                table: "StudentClass");
        }
    }
}
