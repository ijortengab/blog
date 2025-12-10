# Linux - Autostart script saat selesai booting


## Pertanyaan

Bagaimanakah menjalankan script `.sh` segera setelah machine selesai booting
dan bukan setelah user sukses login?

## Gerak Cepat

Pastikan file script dapat dieksekusi.

```
chmod u+x /path/to/your/script.sh
```

Buka crontab melalui editor.

```
crontab -e
```

Tambahkan baris perintah untuk menjalankan script.

```
...
@reboot /path/to/your/script.sh
```

Save, lalu test dengan reboot machine.

```
reboot
```

atau

```
init 6
```

Script akan run setelah reboot, baik user reguler maupun sudo.

## Reference

Googling: debian boot startup script

<https://serverfault.com/questions/735621>

