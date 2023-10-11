IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230627105434_InitIdentityDbContext')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230627105434_InitIdentityDbContext', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230703101004_addCustomFieldsForUserTbl')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [FirstName] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230703101004_addCustomFieldsForUserTbl')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [LastName] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230703101004_addCustomFieldsForUserTbl')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [RefreshToken] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230703101004_addCustomFieldsForUserTbl')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [Status] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230703101004_addCustomFieldsForUserTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230703101004_addCustomFieldsForUserTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [Student] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(256) NOT NULL,
        [AccessToken] nvarchar(max) NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Student] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [TextBooks] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(256) NOT NULL,
        [TextBookLevel] int NOT NULL,
        [Thumbnail] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_TextBooks] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [StudentMedia] (
        [Id] int NOT NULL IDENTITY,
        [ClassId] int NOT NULL,
        [LessonId] int NOT NULL,
        [StudentId] int NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        [Type] int NOT NULL,
        [LikeNumber] int NOT NULL,
        [HeartNumber] int NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_StudentMedia] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_StudentMedia_Student_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Student] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [Classes] (
        [Id] int NOT NULL IDENTITY,
        [TextBookId] int NOT NULL,
        [ClassName] nvarchar(256) NOT NULL,
        [Hash] nvarchar(256) NOT NULL,
        [TextBookLevel] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [Status] int NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Classes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Classes_TextBooks_TextBookId] FOREIGN KEY ([TextBookId]) REFERENCES [TextBooks] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [Lesson] (
        [Id] int NOT NULL IDENTITY,
        [TextBookId] int NOT NULL,
        [Title] int NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Lesson] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Lesson_TextBooks_TextBookId] FOREIGN KEY ([TextBookId]) REFERENCES [TextBooks] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [StudentClass] (
        [StudentId] int NOT NULL,
        [ClassId] int NOT NULL,
        CONSTRAINT [PK_StudentClass] PRIMARY KEY ([ClassId], [StudentId]),
        CONSTRAINT [FK_StudentClass_Classes_ClassId] FOREIGN KEY ([ClassId]) REFERENCES [Classes] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_StudentClass_Student_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Student] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [Content] (
        [Id] int NOT NULL IDENTITY,
        [LessonId] int NOT NULL,
        [PageNumber] int NOT NULL,
        [Name] nvarchar(max) NOT NULL,
        [Type] int NOT NULL,
        [Url] nvarchar(max) NOT NULL,
        [Hash] nvarchar(256) NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_Content] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Content_Lesson_LessonId] FOREIGN KEY ([LessonId]) REFERENCES [Lesson] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE TABLE [PushAndListen] (
        [Id] int NOT NULL IDENTITY,
        [ContentId] int NOT NULL,
        [AudioFileUrl] nvarchar(max) NOT NULL,
        [StartX] int NOT NULL,
        [StartY] int NOT NULL,
        [EndX] int NOT NULL,
        [EndY] int NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_PushAndListen] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_PushAndListen_Content_ContentId] FOREIGN KEY ([ContentId]) REFERENCES [Content] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_Classes_TextBookId] ON [Classes] ([TextBookId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_Content_LessonId] ON [Content] ([LessonId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_Lesson_TextBookId] ON [Lesson] ([TextBookId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_PushAndListen_ContentId] ON [PushAndListen] ([ContentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_StudentClass_StudentId] ON [StudentClass] ([StudentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    CREATE INDEX [IX_StudentMedia_StudentId] ON [StudentMedia] ([StudentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230704103411_addInitialEntitiesTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230704103411_addInitialEntitiesTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230711072445_AddCreatedDateToUser')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [DateCreated] datetimeoffset NOT NULL DEFAULT '0001-01-01T00:00:00.0000000+00:00';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230711072445_AddCreatedDateToUser')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230711072445_AddCreatedDateToUser', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230713075626_addTableTeacherClass')
BEGIN
    CREATE TABLE [TeacherClass] (
        [TeacherId] nvarchar(450) NOT NULL,
        [ClassId] int NOT NULL,
        [Id] int NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_TeacherClass] PRIMARY KEY ([ClassId], [TeacherId]),
        CONSTRAINT [FK_TeacherClass_AspNetUsers_TeacherId] FOREIGN KEY ([TeacherId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_TeacherClass_Classes_ClassId] FOREIGN KEY ([ClassId]) REFERENCES [Classes] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230713075626_addTableTeacherClass')
BEGIN
    CREATE INDEX [IX_TeacherClass_TeacherId] ON [TeacherClass] ([TeacherId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230713075626_addTableTeacherClass')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230713075626_addTableTeacherClass', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060446_removeUnusedColsInStudentTbl')
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Student]') AND [c].[name] = N'AccessToken');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Student] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Student] DROP COLUMN [AccessToken];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060446_removeUnusedColsInStudentTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230718060446_removeUnusedColsInStudentTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD [CreatedBy] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD [CreatedDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD [Id] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD [ModifiedBy] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD [ModifiedDate] datetime2 NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718060807_addAuditFieldsForStudentClassTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230718060807_addAuditFieldsForStudentClassTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    ALTER TABLE [TeacherClass] DROP CONSTRAINT [FK_TeacherClass_AspNetUsers_TeacherId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    DROP INDEX [IX_TeacherClass_TeacherId] ON [TeacherClass];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    ALTER TABLE [Classes] ADD [MainTeacherId] nvarchar(450) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    CREATE INDEX [IX_Classes_MainTeacherId] ON [Classes] ([MainTeacherId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    ALTER TABLE [Classes] ADD CONSTRAINT [FK_Classes_AspNetUsers_MainTeacherId] FOREIGN KEY ([MainTeacherId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230718105056_addMainTeacherInClass')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230718105056_addMainTeacherInClass', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    ALTER TABLE [TeacherClass] DROP CONSTRAINT [PK_TeacherClass];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TeacherClass]') AND [c].[name] = N'Id');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [TeacherClass] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [TeacherClass] DROP COLUMN [Id];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    ALTER TABLE [TeacherClass] ADD [Id] int NOT NULL IDENTITY;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TeacherClass]') AND [c].[name] = N'TeacherId');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [TeacherClass] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [TeacherClass] ALTER COLUMN [TeacherId] nvarchar(450) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    ALTER TABLE [TeacherClass] ADD CONSTRAINT [PK_TeacherClass] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    CREATE INDEX [IX_TeacherClass_ClassId] ON [TeacherClass] ([ClassId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    CREATE INDEX [IX_TeacherClass_TeacherId] ON [TeacherClass] ([TeacherId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    ALTER TABLE [TeacherClass] ADD CONSTRAINT [FK_TeacherClass_AspNetUsers_TeacherId] FOREIGN KEY ([TeacherId]) REFERENCES [AspNetUsers] ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230720102920_updatePkForTeacherClassTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230720102920_updatePkForTeacherClassTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721080430_addQrCodeForClassTbl')
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Classes]') AND [c].[name] = N'Hash');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Classes] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Classes] DROP COLUMN [Hash];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721080430_addQrCodeForClassTbl')
BEGIN
    ALTER TABLE [Classes] ADD [ClassCode] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721080430_addQrCodeForClassTbl')
BEGIN
    ALTER TABLE [Classes] ADD [HashUrl] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721080430_addQrCodeForClassTbl')
BEGIN
    ALTER TABLE [Classes] ADD [QrCodePath] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721080430_addQrCodeForClassTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230721080430_addQrCodeForClassTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Content] DROP CONSTRAINT [FK_Content_Lesson_LessonId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lesson] DROP CONSTRAINT [FK_Lesson_TextBooks_TextBookId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lesson] DROP CONSTRAINT [PK_Lesson];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TextBooks]') AND [c].[name] = N'TextBookLevel');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [TextBooks] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [TextBooks] DROP COLUMN [TextBookLevel];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Lesson]') AND [c].[name] = N'Title');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [Lesson] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [Lesson] DROP COLUMN [Title];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    EXEC sp_rename N'[Lesson]', N'Lessons';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    EXEC sp_rename N'[Lessons].[IX_Lesson_TextBookId]', N'IX_Lessons_TextBookId', N'INDEX';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TextBooks]') AND [c].[name] = N'Thumbnail');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [TextBooks] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [TextBooks] ALTER COLUMN [Thumbnail] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TextBooks]') AND [c].[name] = N'Description');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [TextBooks] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [TextBooks] ALTER COLUMN [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lessons] ADD [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lessons] ADD [Name] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lessons] ADD [Number] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lessons] ADD CONSTRAINT [PK_Lessons] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Content] ADD CONSTRAINT [FK_Content_Lessons_LessonId] FOREIGN KEY ([LessonId]) REFERENCES [Lessons] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    ALTER TABLE [Lessons] ADD CONSTRAINT [FK_Lessons_TextBooks_TextBookId] FOREIGN KEY ([TextBookId]) REFERENCES [TextBooks] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230721092452_UpdateTextBook')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230721092452_UpdateTextBook', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726020421_AddShortNameToTextBook')
BEGIN
    DELETE FROM TextBooks
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726020421_AddShortNameToTextBook')
BEGIN
    ALTER TABLE [TextBooks] ADD [ShortName] nvarchar(2) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726020421_AddShortNameToTextBook')
BEGIN
    CREATE UNIQUE INDEX [IX_TextBooks_ShortName] ON [TextBooks] ([ShortName]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726020421_AddShortNameToTextBook')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230726020421_AddShortNameToTextBook', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Content] DROP CONSTRAINT [FK_Content_Lessons_LessonId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [PushAndListen] DROP CONSTRAINT [FK_PushAndListen_Content_ContentId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Content] DROP CONSTRAINT [PK_Content];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Content]') AND [c].[name] = N'Hash');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Content] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [Content] DROP COLUMN [Hash];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    EXEC sp_rename N'[Content]', N'Contents';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    EXEC sp_rename N'[Contents].[Url]', N'QrCodePath', N'COLUMN';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    EXEC sp_rename N'[Contents].[IX_Content_LessonId]', N'IX_Contents_LessonId', N'INDEX';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Lessons] ADD [LanguageFocus] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Lessons] ADD [Phonics] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD [HashUrl] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD CONSTRAINT [PK_Contents] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD CONSTRAINT [FK_Contents_Lessons_LessonId] FOREIGN KEY ([LessonId]) REFERENCES [Lessons] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    ALTER TABLE [PushAndListen] ADD CONSTRAINT [FK_PushAndListen_Contents_ContentId] FOREIGN KEY ([ContentId]) REFERENCES [Contents] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726021009_updateLessonAndContentTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230726021009_updateLessonAndContentTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Contents]') AND [c].[name] = N'QrCodePath');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Contents] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [Contents] ALTER COLUMN [QrCodePath] nvarchar(2000) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Contents]') AND [c].[name] = N'Name');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [Contents] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [Contents] ALTER COLUMN [Name] nvarchar(256) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Contents]') AND [c].[name] = N'HashUrl');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [Contents] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [Contents] ALTER COLUMN [HashUrl] nvarchar(2000) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD [PageImage] nvarchar(2000) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD [WordwallNetLink] nvarchar(2000) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    ALTER TABLE [Contents] ADD [YoutubeLink] nvarchar(2000) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230726094443_updateContentTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230726094443_updateContentTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230802050053_AddOriginalDimensionToPushAndListen')
BEGIN
    ALTER TABLE [PushAndListen] ADD [OriginalHeight] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230802050053_AddOriginalDimensionToPushAndListen')
BEGIN
    ALTER TABLE [PushAndListen] ADD [OriginalWidth] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230802050053_AddOriginalDimensionToPushAndListen')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230802050053_AddOriginalDimensionToPushAndListen', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803021809_AddNameToPushAndListen')
BEGIN
    ALTER TABLE [PushAndListen] ADD [Name] nvarchar(256) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803021809_AddNameToPushAndListen')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230803021809_AddNameToPushAndListen', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentClass] DROP CONSTRAINT [FK_StudentClass_Student_StudentId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentMedia] DROP CONSTRAINT [FK_StudentMedia_Student_StudentId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentMedia] DROP CONSTRAINT [PK_StudentMedia];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [Student] DROP CONSTRAINT [PK_Student];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    EXEC sp_rename N'[StudentMedia]', N'StudentMedias';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    EXEC sp_rename N'[Student]', N'Students';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    EXEC sp_rename N'[StudentMedias].[IX_StudentMedia_StudentId]', N'IX_StudentMedias_StudentId', N'INDEX';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[StudentMedias]') AND [c].[name] = N'Url');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [StudentMedias] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [StudentMedias] ALTER COLUMN [Url] nvarchar(2000) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentMedias] ADD [Thumbnail] nvarchar(2000) NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentMedias] ADD CONSTRAINT [PK_StudentMedias] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [Students] ADD CONSTRAINT [PK_Students] PRIMARY KEY ([Id]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentClass] ADD CONSTRAINT [FK_StudentClass_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    ALTER TABLE [StudentMedias] ADD CONSTRAINT [FK_StudentMedias_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803035745_updateStudentMediaAndStudentTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230803035745_updateStudentMediaAndStudentTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803070511_UpdateShortCodeAndPhoneType')
BEGIN
    DROP INDEX [IX_TextBooks_ShortName] ON [TextBooks];
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[TextBooks]') AND [c].[name] = N'ShortName');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [TextBooks] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [TextBooks] ALTER COLUMN [ShortName] nvarchar(3) NOT NULL;
    CREATE UNIQUE INDEX [IX_TextBooks_ShortName] ON [TextBooks] ([ShortName]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803070511_UpdateShortCodeAndPhoneType')
BEGIN
    ALTER TABLE [AspNetUsers] ADD [PhoneType] int NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803070511_UpdateShortCodeAndPhoneType')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230803070511_UpdateShortCodeAndPhoneType', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803083806_changeNumberColTypeLessonTbl')
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Lessons]') AND [c].[name] = N'Number');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [Lessons] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [Lessons] ALTER COLUMN [Number] int NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230803083806_changeNumberColTypeLessonTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230803083806_changeNumberColTypeLessonTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804032316_addOrderColLessonTbl')
BEGIN
    DECLARE @var15 sysname;
    SELECT @var15 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Lessons]') AND [c].[name] = N'Number');
    IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [Lessons] DROP CONSTRAINT [' + @var15 + '];');
    ALTER TABLE [Lessons] ALTER COLUMN [Number] nvarchar(256) NOT NULL;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804032316_addOrderColLessonTbl')
BEGIN
    ALTER TABLE [Lessons] ADD [Order] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804032316_addOrderColLessonTbl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230804032316_addOrderColLessonTbl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClass] DROP CONSTRAINT [FK_StudentClass_Classes_ClassId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClass] DROP CONSTRAINT [FK_StudentClass_Students_StudentId];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClass] DROP CONSTRAINT [PK_StudentClass];
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    EXEC sp_rename N'[StudentClass]', N'StudentClasses';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    EXEC sp_rename N'[StudentClasses].[IX_StudentClass_StudentId]', N'IX_StudentClasses_StudentId', N'INDEX';
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClasses] ADD CONSTRAINT [PK_StudentClasses] PRIMARY KEY ([ClassId], [StudentId]);
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClasses] ADD CONSTRAINT [FK_StudentClasses_Classes_ClassId] FOREIGN KEY ([ClassId]) REFERENCES [Classes] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    ALTER TABLE [StudentClasses] ADD CONSTRAINT [FK_StudentClasses_Students_StudentId] FOREIGN KEY ([StudentId]) REFERENCES [Students] ([Id]) ON DELETE CASCADE;
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230804035125_renameStudentClassesTBl')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230804035125_renameStudentClassesTBl', N'7.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230809105413_AddStudentMediaProcessing')
BEGIN
    CREATE TABLE [StudentMediaProcessings] (
        [Id] int NOT NULL IDENTITY,
        [RequestId] uniqueidentifier NOT NULL,
        [Status] int NOT NULL,
        [BytesSent] bigint NOT NULL,
        [Exception] nvarchar(max) NULL,
        [CreatedDate] datetime2 NOT NULL,
        [CreatedBy] nvarchar(max) NULL,
        [ModifiedDate] datetime2 NULL,
        [ModifiedBy] nvarchar(max) NULL,
        CONSTRAINT [PK_StudentMediaProcessings] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20230809105413_AddStudentMediaProcessing')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20230809105413_AddStudentMediaProcessing', N'7.0.8');
END;
GO

COMMIT;
GO

