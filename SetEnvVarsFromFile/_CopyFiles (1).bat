@echo off
setlocal enabledelayedexpansion
set extension=%~1
set sourcefolder=%~2
set destination=%3

set source="%sourcefolder%%extension%"

if not exist %3 mkdir %3
echo ----------------------------------------------
echo Extension:%extension%
echo Sourcefolder:%sourcefolder%
echo Destination:%destination%
echo Source:%source%

xcopy %source% %destination% /S /Q /I /Y /E
REM   /S           Copies directories and subdirectories except empty ones.
REM   /Q           Does not display file names while copying.
REM   /I           If destination does not exist and copying more than one file, assumes that destination must be a directory.
REM   /Y           Suppresses prompting to confirm you want to overwrite an existing destination file.
REM   /E           Copies directories and subdirectories, including empty ones. Same as /S /E. May be used to modify /T.

if NOT ["%errorlevel%"]==["0"] (
    cscript %0\..\error.vbs
)

REM FOR /R %source% %%B IN (%extension%) DO (
REM     copy "%%~fB" %destination%
    REM you could do the delete in here too, 
    REM but it's probably faster the way you have it
REM )


rem forfiles /P %source% /S /M %extension% /C "cmd /c @copy @path %destination%"

rem robocopy /s %source% %destination%