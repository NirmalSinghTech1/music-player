for %%f in (images\*) do (
    C:\libwebp-1.6.0-windows-x64\bin\cwebp.exe -q 40 "%%f" -o "%%~dpnf.webp"
)
