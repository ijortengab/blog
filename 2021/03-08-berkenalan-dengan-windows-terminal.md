---
title: Berkenalan dengan Windows Terminal
tags:
  - wt
---

## Command Prompt, PowerShell, Mintty, dan Windows Terminal

Console untuk Windows adalah aplikasi `cmd.exe` dan terbaru adalah `powershell.exe`.

Console untuk Cygwin adalah aplikasi `mintty.exe`.

Console untuk WSL 2 adalah aplikasi `wsl.exe`. Jika di dalam WSL 2 menginstall distro Ubuntu `18.04` atau `20.04`, maka akan terdapat console `ubuntu1804.exe` maupun `ubuntu2004.exe` yang meng-induk ke `wsl.exe`.

Windows Terminal `wt.exe` hadir menggabungkan keseluruhan console tersebut.

Blog terkait:

 > [Berkenalan dengan Windows Subsytem of Linux (WSL)](/blog/2021/03/06/berkenalan-dengan-windows-subsytem-of-linux-wsl/)
 >
 > [Windows rasa Linux - remote Windows dengan CLI menggunakan Cygwin-OpenSSH](/blog/2017/01/28/windows-rasa-linux-cygwin-openssh-server/)

## Fitur Utama

Fitur tab adalah **alasan utama** akhirnya menggunakan Windows Terminal.

![Screenshot.](/images/2021/screenshot.2021-03-08_08.49.32.jpg)

Bahkan dalam satu `tab` masih dapat di-split menjadi beberapa `pane` (sub tab).

![Screenshot.](/images/2021/screenshot.2021-03-08_08.52.50.jpg)

## Install

Untuk memasang `Windows Terminal` kunjungi `page` di Microsoft Store.

Link cepat:

 1. Klik link berikut di mesin Windows: [ms-windows-store://pdp?productId=9n0dx20hk701](ms-windows-store://pdp?productId=9n0dx20hk701)

 2. Klik link berikut di browser: https://www.microsoft.com/store/apps/9n0dx20hk701

## Konfigurasi

Konfigurasi/setting dilakukan dengan mengedit file `settings.json` (Ctrl+,) dan sudah auto reload saat menyimpan perubahan file tersebut.

Format JSON tersebut diluar standard yakni terdapat `comment` yang diawali dengan karakter `//`.

## Integrasi dengan Cygwin.

Untuk menambahkan Cygwin 64bit, tambahkan object berikut di dalam array `list`:

```
{
    ...
    "profiles":
    {
        ...
        "list":
        [
            ...
            {
                "guid": "{00000000-0000-0000-0000-000000000001}",
                "name" : "Cygwin",
                "commandline" : "c:/cygwin64/bin/bash --login -i",
                "icon" : "c:/cygwin64/Cygwin.ico",
                "startingDirectory" : "c:/cygwin64/bin"
            }
            ...
        ]
        ...
    }
    ...
}
```

## Behaviour seperti Mintty

Keunggulan `mintty.exe` adalah auto copy saat select.

Windows Terminal pun mengadopsi fitur serupa dengan set value `true` pada key `copyOnSelect`

```
{
    ...
    "copyOnSelect": true
    ...
}
```

## Behaviour seperti Browser Chrome

Konfigurasi `tab` berikut menjadikan penggunaan Windows Terminal seperti browser Chrome.

```
{
    ...
    "actions":
    {
        ...
        { "command": "newTab", "keys": "ctrl+t" },
        { "command": "duplicateTab", "keys": "ctrl+shift+t" },
        { "command": "newWindow", "keys": "ctrl+n" },
        { "command": "nextTab", "keys": "ctrl+pgdn" },
        { "command": "prevTab", "keys": "ctrl+pgup" },
        { "command": { "action": "switchToTab", "index": 0 }, "keys": "ctrl+1" },
        { "command": { "action": "switchToTab", "index": 1 }, "keys": "ctrl+2" },
        { "command": { "action": "switchToTab", "index": 2 }, "keys": "ctrl+3" },
        { "command": { "action": "switchToTab", "index": 3 }, "keys": "ctrl+4" },
        { "command": { "action": "switchToTab", "index": 4 }, "keys": "ctrl+5" },
        { "command": { "action": "switchToTab", "index": 5 }, "keys": "ctrl+6" },
        { "command": { "action": "switchToTab", "index": 6 }, "keys": "ctrl+7" },
        { "command": { "action": "switchToTab", "index": 7 }, "keys": "ctrl+8" },
        { "command": { "action": "switchToTab", "index": 8 }, "keys": "ctrl+9" },
        { "command": "closePane", "keys": "ctrl+w" }
        ...
    }
}
```

## Custom Setting

Berikut ini tambahan setting:

 - CTRL+v sebagai paste
 - CTRL+f sebagai find
 - CTRL+d sebagai Split Tab menjadi dua pane secara auto.
 - CTRL+| sebagai Split Tab menjadi dua pane secara vertical.
 - CTRL+_ sebagai Split Tab menjadi dua pane secara horizontal.

```
{
    ...
    "actions":
    {
        ...
        { "command": "paste", "keys": "ctrl+v" },
        { "command": "find", "keys": "ctrl+f" },
        { "command": { "action": "splitPane", "split": "auto", "splitMode": "duplicate" }, "keys": "ctrl+d" },
        { "command": { "action": "splitPane", "split": "horizontal" }, "keys": "ctrl+_" },
        { "command": { "action": "splitPane", "split": "vertical" }, "keys": "ctrl+|" }
        ...
    }
}
```

No warning karena annoying.

```
{
    ...
    "multiLinePasteWarning": false,
    "largePasteWarning": false,
    "confirmCloseAllTabs": false
    ...
}
```

## Launcher menggunakan Autohotkey

Kita jadikan kombinasi `Windows+Shift+a` berarti menjalankan Windows Terminal atau jadikan windows *active* jika sudah exists.

Isi dari file `hotkey.ahk`

```
#+a::
    if WinExist("ahk_exe WindowsTerminal.exe")
        WinActivate, ahk_exe WindowsTerminal.exe
    else
        Run, wt.exe
    Return
```

Untuk menjalankan file dot ahk, membutuhkan [Autohotkey](https://www.autohotkey.com/).

## Reference

https://nickjanetakis.com/blog/a-linux-dev-environment-on-windows-with-wsl-2-docker-desktop-and-more

https://devblogs.microsoft.com/commandline/introducing-windows-terminal/

https://stackoverflow.com/questions/56102345/windows-terminal-and-mingw-cygwin

https://robbiecrash.me/cygwin-windows-terminal/

https://docs.microsoft.com/en-us/windows/terminal/customize-settings/appearance
