cd "%~dp0" && npm run start

if %errorlevel% neq 0 (
    echo Failed to start the application.
    exit /b %errorlevel%
) else (
    echo Application started successfully.
)