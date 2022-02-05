@echo off

if exist "config.json" GOTO END

(
  Echo;{
  Echo;  "VERBOSE_LOG": true
  Echo;}
) > "config.json"

:END