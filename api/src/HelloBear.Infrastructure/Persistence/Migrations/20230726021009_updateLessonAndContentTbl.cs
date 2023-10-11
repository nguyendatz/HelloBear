using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HelloBear.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class updateLessonAndContentTbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Content_Lessons_LessonId",
                table: "Content");

            migrationBuilder.DropForeignKey(
                name: "FK_PushAndListen_Content_ContentId",
                table: "PushAndListen");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Content",
                table: "Content");

            migrationBuilder.DropColumn(
                name: "Hash",
                table: "Content");

            migrationBuilder.RenameTable(
                name: "Content",
                newName: "Contents");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Contents",
                newName: "QrCodePath");

            migrationBuilder.RenameIndex(
                name: "IX_Content_LessonId",
                table: "Contents",
                newName: "IX_Contents_LessonId");

            migrationBuilder.AddColumn<string>(
                name: "LanguageFocus",
                table: "Lessons",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phonics",
                table: "Lessons",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "HashUrl",
                table: "Contents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Contents",
                table: "Contents",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contents_Lessons_LessonId",
                table: "Contents",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PushAndListen_Contents_ContentId",
                table: "PushAndListen",
                column: "ContentId",
                principalTable: "Contents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contents_Lessons_LessonId",
                table: "Contents");

            migrationBuilder.DropForeignKey(
                name: "FK_PushAndListen_Contents_ContentId",
                table: "PushAndListen");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Contents",
                table: "Contents");

            migrationBuilder.DropColumn(
                name: "LanguageFocus",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "Phonics",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "HashUrl",
                table: "Contents");

            migrationBuilder.RenameTable(
                name: "Contents",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "QrCodePath",
                table: "Content",
                newName: "Url");

            migrationBuilder.RenameIndex(
                name: "IX_Contents_LessonId",
                table: "Content",
                newName: "IX_Content_LessonId");

            migrationBuilder.AddColumn<string>(
                name: "Hash",
                table: "Content",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Content",
                table: "Content",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Content_Lessons_LessonId",
                table: "Content",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PushAndListen_Content_ContentId",
                table: "PushAndListen",
                column: "ContentId",
                principalTable: "Content",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
