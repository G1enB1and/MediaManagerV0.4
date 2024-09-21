@echo off
REM Get the directory of the batch file
SET "BATCH_DIR=%~dp0"

REM Change to the project root directory (MediaManagerV0.4 folder)
cd /d "%BATCH_DIR%..\MediaManagerV0.4"

REM Run the script to generate images.json
echo Generating images.json...
python backend/generate_images_json.py

REM Run the script to generate file_tree.json
echo Generating file_tree.json...
python backend/generate_file_tree_json.py

REM Run the server script
echo Starting the server...
python backend/server.py

REM Keep the terminal open to display any errors
echo.
echo Server is running. Press Ctrl+C to stop.
pause
