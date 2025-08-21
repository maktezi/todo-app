### Docker Setup *(Optional)*
If you prefer using Docker:

1. Clone the repository:
    ```bash
    git clone https://github.com/maktezi/laravel-vue.git
   
    cd laravel-vue
    ```
2. Copy the `.env.example` file and generate the application key and OTP key:
    ```bash
    cp .env.example .env
    php artisan key:generate
    php artisan otp:generate-key
    ```

3. Build and start the Docker containers:
    ```bash
    docker compose up -d --build
    ```

4. Run database migrations and seeders:
    ```bash
    docker compose exec backend php artisan migrate:fresh --seed
    ```

5. Access the frontend at `http://localhost:3000` and the backend at `http://localhost:8000`.

---

### Manual Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/maktezi/laravel-vue.git
   
    cd laravel-vue
    ```

2. Install the backend dependencies:
    ```bash
    composer install
    ```

3. Copy the example environment file and set up environment variables:
    ```bash
    cp .env.example .env && php artisan key:generate && php artisan otp:generate-key
    ```

4. Set up the database configuration in the `.env` file and run migration and seeders:
    ```bash
    php artisan migrate:fresh --seed
    ```

5. Install the frontend dependencies:
    ```bash
    bun install
    ```

6. Start the Nuxt.js development server and Laravel server:
    ```bash
    bun start
    ```

7. Open your browser and navigate to `http://localhost:3000` & `http://localhost:8000` for the front-end and back-end respectively

8. To run cron job:
    ```bash
    php artisan schedule:run
    ```
   For production, add the following to your system's crontab to run the scheduler every minute:
    ```bash
    * * * * * cd /path-to-app && php artisan schedule:run >> /dev/null 2>&1
    ```
   This ensures all scheduled tasks run automatically based on their defined schedule.

### Testing API performance

```bash
bun octane
```

```bash
bun api:test
```

## GraphQL API

GraphQL queries and mutations are handled by **Laravel Lighthouse**. You can explore and test the GraphQL API through the GraphQL Playground available at:
```bash
http://localhost:8000/graphiql
```

## Generating GraphQL Types
To generate the GraphQL types, run the following command:

```bash
bun codegen
```
