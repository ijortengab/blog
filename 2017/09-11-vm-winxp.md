---
title: Virtual Machine - Nostalgia Windows XP
---

## Nostalgia Windows XP

Saat ini untuk mengenang dan nostalgia Windows XP, kita bisa memasangnya di 
virtual machine secara gratis tanpa direpotkan dengan lisensi.

Instalasi Windows XP di virtual machine menggunakan VirtualBox telah dibahas
pada [tulisan sebelumnya][6]. 

Berikut ini adalah langkah-langkah selanjutnya setelah menginstall Windows XP.

## Shared Folder

VirtualBox mendukung Shared Files (CIFS atau SMB) dimana Host sebagai server SMB
dan Guest sebagai client SMB.

Dapat diset permanen atau temporary dan langsung tanpa perlu shutdown Guest.

Masuk ke Machine >> Settings.

![Screenshot.](/images/screenshot.1182.png)

Tab Shared Folders >> Add new shared folders.

![Screenshot.](/images/screenshot.1183.png)

Saya menjadikan folder `Downloads` yang berlokasi di `%HOMEDRIVE%%HOMEPATH%`
atau `C:\Users\X220\Downloads` sebagai folder sharing dari Host (SMB server) 
untuk diakses oleh Guest (SMB client).

![Screenshot.](/images/screenshot.1184.png)

Cara mengakses dari client adalah dengan meng-explore `My Network Places`. 

![Screenshot.](/images/screenshot.1185.png)

Lokasi folder sharing `Downloads`-nya Host dari Guest berada di
`My Network Places >> VirtualBox Shared Folders >> Vboxsvr`.

![Screenshot.](/images/screenshot.1186.png)

## Browser

Kita perlu mengganti Browser Internet Explorer 6 (IE6) bawaan Windows XP dengan 
Mozilla Firefox atau Google Chrome. Meskipun baik [Mozilla Firefox][9] maupun 
[Google Chrome][10] secara resmi sudah tidak lagi mendukung Windows XP.

**Firefox**

Versi terakhir Firefox yang mendukung Windows XP adalah `52.3`. 
[Link Download][7] (Direct).

**Chrome**

Versi terakhir Google Chrome yang mendukung Windows XP adalah `49`. Google 
tidak menyediakan akses direct download sehingga harus 
[mencari-cari di internet][5]. [Link Download][8] (Google Drive).

Download program setup diatas melalui Host (Windows 7). Kemudian install setup 
Firefox dan Google Chrome dari Windows XP yang mengakses folder sharing Host.

![Screenshot.](/images/screenshotxp.1.png)

Setelah kedua browser tersebut terinstall, katakan selamat tinggal untuk IE6.

## Programs

Setelah browser terinstall, saatnya menginstall program sesuai selera 
masing-masing. Setidaknya program screenshot tools, [LightScreen], perlu 
diinstall.

## Security

Microsoft telah resmi tidak lagi [mendukung Windows XP][1], baik itu bug maupun 
celah keamanan.

Beberapa kasus yang berskala global membuat Microsoft terpaksa menyediakan
**custom_update** (bukan extended update) bagi Windows XP. Diantaranya adalah
kasus ransomware wannacrypt.

 - [Microsoft Security Bulletin MS17-010][2] (Article)
 - [MS17-010: Description of the security update for Windows SMB Server: March 14, 2017][3] (Article)
 - [Customer Guidance for WannaCrypt attacks][11] (Article)
 - [Security Update for Windows XP SP3 (KB4012598)][4] (Download)

Meski demikian, update security ini dapat diabaikan karena tujuan menggunakan
Windows XP sebatas testing. Set Automatic Update sebagai "Notify me only".

![Screenshot.](/images/screenshotxp.10.png)
 
## Background Bliss

Terakhir adalah kosmetik. Background Bliss tidak turut terbawa oleh program 
Windows XP Mode. Sehingga perlu kita set manual dengan mencarinya melalui 
internet.

![Screenshot.](/images/screenshotxp.2.png)

## Finish

Selamat bernostalgia dengan Windows XP.

![Screenshot.](/images/screenshotxp.3.png)

## Reference

[1]: https://support.microsoft.com/en-us/help/14223/windows-xp-end-of-support

<https://support.microsoft.com/en-us/help/14223/windows-xp-end-of-support>

<https://www.microsoft.com/en-us/windowsforbusiness/end-of-xp-support>

[2]: https://technet.microsoft.com/library/security/ms17-010

<https://technet.microsoft.com/library/security/ms17-010>

[3]: https://support.microsoft.com/en-us/help/4012598/title

<https://support.microsoft.com/en-us/help/4012598/title>

[4]: https://www.microsoft.com/en-us/download/details.aspx?id=55245

<https://www.microsoft.com/en-us/download/details.aspx?id=55245>

[5]: /blog/2017/09/10/google-chrome-for-windows-xp-v49-offline-installer-standalone/

[6]: /blog/2017/09/07/vm-install-windows-legal-dan-gratis/

[7]: https://download-sha1.cdn.mozilla.net/pub/firefox/releases/52.3.0esr/win32-sha1/en-US/Firefox%20Setup%2052.3.0esr.exe

[8]: https://drive.google.com/open?id=0BxWiel2cIcRaRXNtYjlfbWw4Sm8

[9]: https://support.mozilla.org/en-US/kb/end-support-windows-xp-and-vista

<https://support.mozilla.org/en-US/kb/end-support-windows-xp-and-vista>

[10]: https://chrome.googleblog.com/2015/11/updates-to-chrome-platform-support.html

<https://chrome.googleblog.com/2015/11/updates-to-chrome-platform-support.html>

[11]: https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/

<https://blogs.technet.microsoft.com/msrc/2017/05/12/customer-guidance-for-wannacrypt-attacks/>

[LightScreen]: http://lightscreen.com.ar/
