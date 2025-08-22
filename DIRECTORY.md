.
|-- DIRECTORY.md
|-- Dockerfile
|-- README.md
|-- _lighthouse_ide_helper.php
|-- app
|   |-- Console
|   |   `-- Commands
|   |       |-- DeleteOldTasks.php
|   |       `-- GenerateOtpSecretKey.php
|   |-- Events
|   |   `-- TaskUpdated.php
|   |-- GraphQL
|   |   |-- Mutations
|   |   |   |-- Login.php
|   |   |   |-- Logout.php
|   |   |   |-- OtpMutator.php
|   |   |   |-- Upload.php
|   |   |   `-- UserMutator.php
|   |   `-- Resolvers
|   |       |-- TaskResolver.php
|   |       `-- UserResolver.php
|   |-- Http
|   |   |-- Controllers
|   |   |   |-- Api
|   |   |   |   |-- AuthController.php
|   |   |   |   `-- UserController.php
|   |   |   `-- Controller.php
|   |   `-- Middleware
|   |       `-- RoleMiddleware.php
|   |-- Mail
|   |   |-- SendOtpMail.php
|   |   `-- UserStatusChanged.php
|   |-- Models
|   |   |-- Permission.php
|   |   |-- Role.php
|   |   |-- Task.php
|   |   `-- User.php
|   |-- Providers
|   |   |-- AppServiceProvider.php
|   |   `-- AuthServiceProvider.php
|   `-- Traits
|       `-- HasGraphQLScopes.php
|-- artisan
|-- bootstrap
|   |-- app.php
|   |-- cache
|   |   |-- packages.php
|   |   `-- services.php
|   `-- providers.php
|-- bun.lock
|-- client
|   |-- Dockerfile
|   |-- app.vue
|   |-- assets
|   |   `-- css
|   |       `-- main.css
|   |-- components
|   |   |-- AppHeader.vue
|   |   |-- AppSidebar.vue
|   |   |-- CrudTable.vue
|   |   |-- DatePickerButton.vue
|   |   |-- FluidCursor.vue
|   |   |-- modal
|   |   |   |-- Confirm.vue
|   |   |   |-- Form.vue
|   |   |   |-- Otp.vue
|   |   |   `-- View.vue
|   |   |-- table
|   |   |   |-- Data.vue
|   |   |   `-- types.ts
|   |   `-- ui
|   |       |-- DatePicker.vue
|   |       `-- SpinnerLoader.vue
|   |-- composables
|   |   |-- useConstants.ts
|   |   |-- useCopyClipboard.ts
|   |   |-- useLinks.ts
|   |   |-- useSearchQueryOptions.ts
|   |   `-- useTableData.ts
|   |-- graphql
|   |   |-- Auth.ts
|   |   |-- Fragment.ts
|   |   |-- Permission.ts
|   |   |-- Role.ts
|   |   |-- Task.ts
|   |   `-- User.ts
|   |-- layouts
|   |   |-- app-layout.vue
|   |   `-- default.vue
|   |-- lib
|   |   `-- utils.ts
|   |-- middleware
|   |   `-- auth.global.ts
|   |-- pages
|   |   |-- Login.vue
|   |   |-- Register.vue
|   |   |-- dashboard
|   |   |   `-- index.vue
|   |   |-- index.vue
|   |   |-- notfound.vue
|   |   |-- tasks
|   |   |   |-- components
|   |   |   |   |-- kanban-board.vue
|   |   |   |   `-- manage-task.vue
|   |   |   |-- data
|   |   |   |   |-- columns.ts
|   |   |   |   |-- schema.ts
|   |   |   |   `-- types.ts
|   |   |   |-- index.vue
|   |   |   `-- utils
|   |   |       `-- helper.ts
|   |   |-- unauthorized.vue
|   |   `-- users
|   |       |-- components
|   |       |   |-- manage-permission.vue
|   |       |   |-- manage-role.vue
|   |       |   `-- manage-user.vue
|   |       |-- data
|   |       |   |-- permission
|   |       |   |   |-- columns.ts
|   |       |   |   `-- schema.ts
|   |       |   |-- role
|   |       |   |   |-- columns.ts
|   |       |   |   `-- schema.ts
|   |       |   `-- user
|   |       |       |-- authSchema.ts
|   |       |       |-- columns.ts
|   |       |       `-- schema.ts
|   |       `-- index.vue
|   |-- plugins
|   |   `-- echo.client.js
|   |-- stores
|   |   |-- authStore.ts
|   |   `-- taskStore.ts
|   |-- types
|   |   |-- codegen
|   |   |   |-- fragment-masking.ts
|   |   |   |-- gql.ts
|   |   |   |-- graphql.ts
|   |   |   `-- index.ts
|   |   |-- fields.ts
|   |   `-- global.ts
|   `-- utils
|       `-- helpers.ts
|-- codegen.ts
|-- composer.json
|-- composer.lock
|-- config
|   |-- app.php
|   |-- auth.php
|   |-- broadcasting.php
|   |-- cache.php
|   |-- cors.php
|   |-- database.php
|   |-- filesystems.php
|   |-- lighthouse.php
|   |-- logging.php
|   |-- mail.php
|   |-- octane.php
|   |-- permission.php
|   |-- queue.php
|   |-- reverb.php
|   |-- sanctum.php
|   |-- services.php
|   `-- session.php
|-- database
|   |-- factories
|   |   |-- TaskFactory.php
|   |   `-- UserFactory.php
|   |-- migrations
|   |   |-- 0001_01_01_000000_create_users_table.php
|   |   |-- 0001_01_01_000001_create_cache_table.php
|   |   |-- 0001_01_01_000002_create_jobs_table.php
|   |   |-- 2025_02_28_125236_create_personal_access_tokens_table.php
|   |   |-- 2025_03_08_130917_create_permission_tables.php
|   |   `-- 2025_08_01_150949_create_tasks_table.php
|   `-- seeders
|       `-- DatabaseSeeder.php
|-- docker-compose.yml
|-- eslint.config.mjs
|-- graphql
|   |-- Models
|   |   |-- Permission.graphql
|   |   |-- Role.graphql
|   |   |-- Task.graphql
|   |   `-- User.graphql
|   |-- auth.graphql
|   `-- schema.graphql
|-- nginx
|   `-- default.conf
|-- nuxt.config.ts
|-- package.json
|-- phpunit.xml
|-- programmatic-types.graphql
|-- public
|   |-- favicon.ico
|   |-- index.php
|   `-- robots.txt
|-- resources
|   |-- css
|   |   `-- app.css
|   |-- js
|   |   |-- app.js
|   |   `-- bootstrap.js
|   `-- views
|       |-- emails
|       |   |-- otp.blade.php
|       |   `-- user_status_changed.blade.php
|       `-- welcome.blade.php
|-- routes
|   |-- api.php
|   |-- channels.php
|   |-- console.php
|   `-- web.php
|-- schema-directives.graphql
|-- server
|   `-- tsconfig.json
|-- tailwind.config.js
|-- tests
|   |-- Feature
|   |   |-- ExampleTest.php
|   |   `-- TaskTest.php
|   |-- TestCase.php
|   `-- Unit
|       `-- ExampleTest.php
`-- tsconfig.json
