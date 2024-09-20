@echo off
REM Get the directory of the batch file
SET "BATCH_DIR=%~dp0"

REM Change to the project root directory (MediaManagerV0.4 folder)
cd /d "%BATCH_DIR%..\MediaManagerV0.4"

REM Run the server script
python backend/server.py

REM Keep the terminal open to display any errors
echo.
echo Server is running. Press Ctrl+C to stop.
pause
