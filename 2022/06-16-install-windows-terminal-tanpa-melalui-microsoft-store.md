---
tags:
  - wt
---

# Install Windows Terminal tanpa melalui Microsoft Store

## Cygwin

Gerak cepat, jika menggunakan Cygwin, gunakan terminal `mintty.exe`. Sesuaikan variable `$windows_version`, lalu eksekusi:

```
windows_version=10 # 10 or 11
curl -s https://api.github.com/repos/microsoft/terminal/releases/latest \
| grep "browser_download_url.*Win${windows_version}.*msixbundle" \
| grep -Fv '.zip' \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -
powershell.exe -Command Add-AppxPackage $(ls Microsoft.WindowsTerminal_Win${windows_version}_*_*.msixbundle)
cmd.exe /C wt
```

Windows Terminal berhasil terinstall dan autolunch. Hapus file `.msixbundle`:

```
ls Microsoft.WindowsTerminal_Win${windows_version}_*_*.msixbundle | xargs rm
```

## Command Prompt

Cara lain, menggunakan Command Prompt, download `release` secara manual.

Kunjungi halaman berikut: https://github.com/microsoft/terminal/releases

Pilih version terbaru, misal: `v1.14.1451.0`.

Download file `.msixbundle` sesuaikan dengan versi Windows, misal:

https://github.com/microsoft/terminal/releases/download/v1.14.1451.0/Microsoft.WindowsTerminalPreview_Win10_1.14.1451.0_8wekyb3d8bbwe.msixbundle

Umumnya file hasil download berada pada direktori `%USERPROFILE%\Downloads`. Buka `Command Prompt`, eksekusi:

```
cd %USERPROFILE%\Downloads
dir /B Microsoft.WindowsTerminal*msixbundle > .tmpFile
set /p msixbundle= < .tmpFile
del .tmpFile
powershell.exe -Command Add-AppxPackage %msixbundle%
wt
```

Windows Terminal berhasil terinstall dan autolunch. Hapus file `.msixbundle`:

```
del Microsoft.WindowsTerminal*msixbundle
```

## Tips

Gerak Cepat menjalankan Windows Terminal melalui Run.

Buka Run, ketikkan `wt`, Enter.

## Reference

[Installing Windows Terminal Without The Microsoft Store](https://hackmd.io/@ss14/windows-terminal)

https://stackoverflow.com/questions/6359820/how-to-set-commands-output-as-a-variable-in-a-batch-file

[One Liner to Download the Latest Release from Github Repo.md](https://gist.github.com/steinwaywhw/a4cd19cda655b8249d908261a62687f8)
