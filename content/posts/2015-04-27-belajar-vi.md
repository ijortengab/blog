---
title: Belajar menggunakan text editor VI
slug: /blog/2015/04/27/belajar-vi/
date: 2015-04-27
---

Vi (dibaca vi ai) adalah text editor dalam Command Line Interface (CLI).

Banyak tutorial *vi* di internet. Tutorialku ini lebih fokus kepada migrasi shortcut (jalan ringkas) saat menggunakan software [notepad++](http://notepad-plus-plus.org/).

Aku terpaksa belajar vi karena kedepannya software ini akan sangat berguna untuk ngoprek server.

## Naik turun layar

Notepad++     | vi                                     | Keterangan
------------- | :------------------------------------- | :-------------------------- 
*Page Up*     | *Page Up* atau *Ctrl*+*b* (Backward)   |
*Page Down*   | *Page Down* atau *Ctrl*+*f* (Forward)  |
-             | *Ctrl*+*u* (up)                        | untuk naik setengah layar
-             | *Ctrl*+*d* (down)                      | untuk turun setengah layar


## Memindahkan cursor

Notepad++               | vi
----------------------- | :---------------------
*Arrow Up*              | *Arrow Up* atau *k*
*Arrow Down*            | *Arrow Down* atau *j*
*Arrow Left*            | *Arrow Left* atau *h*
*Arrow Right*           | *Arrow Right* atau *l* atau *Space*
*Home*                  | *^* 
*End*                   | *$* (simbol dollar)
*Ctrl*+*Arrow Left*     | *b*
*Ctrl*+*Arrow Right*    | *w*  
*Ctrl*+*Home*           | *:0*
*Ctrl*+*End*            | *:$* (1)
*Ctrl*+*g*              | *:N* (2)
                        | *0* (angka nol) atau *Enter/Return* (3)

Catatan tambahan:
 
 1. Pada Notepad++, *Ctrl*+*End* memindahkan cursor ke baris terakhir dan karakter terakhir pada baris tersebut. Sementara pada vi, *:$*  memindahkan cursor ke baris terakhir dan karakter pertama pada baris tersebut.
 2. Pada Notepad++, *Ctrl*+*g* tidak hanya menuju baris tertentu tetapi juga dapat menuju ke karakter kesekian. Pada vi, ketik *:N* dimana N adalah angka integer, maka kita akan menuju ke line N.
 3. Pada vi, *0* (angka nol) atau *Enter/Return* berarti pindah cursor ke awal baris berikutnya dari baris cursor saat ini.

## Edit text

Nah, ini yang paling penting. Di Notepad++ tidak ada istilah *command mode* dan *insert mode*, keseluruhan dari Notepad++ adalah *insert mode*.

### Menambah karakter

Tombol  | Keterangan
------- | :---------------------
*i*     | Masuk ke *insert mode*, menambah karakter sebelum kursor
*a*     | Masuk ke *insert mode*, menambah karakter setelah kursor
*I*     | Masuk ke *insert mode*, cursor berpindah ke awal baris.
*A*     | Masuk ke *insert mode*, cursor berpindah ke akhir baris.
*o*     | Masuk ke *insert mode*, buat baris baru dibawah baris saat ini.
*O*     | Masuk ke *insert mode*, buat baris baru diatas baris saat ini.

*Insert mode* akan berakhir setelah tombol *Esc* ditekan.

### Mengganti karakter

Penggantian karakter ini mirip dengan menekan tombol *Insert* pada Notepad++, dimana setiap karakter yang ditekan akan menggantikan karakter dibawah cursor alih-alih menambah karakter.

Tombol  | Keterangan
------- | :---------------------
*r*     | Masuk ke *insert mode*, mengganti satu karakter dibawah cursor, 
        | setelah karakter diganti, otomatis kembali ke *command mode*
*R*     | Masuk ke *insert mode*, mengganti karakter sesuai dengan posisi cursor saat ini.
*cw*    | Masuk ke *insert mode*, mengganti karakter dari posisi cursor sampai saat ini, 
        | sampai akhir kata. Setelah itu manambah karakter.        
*cNw*   | Masuk ke *insert mode*, mengganti karakter dari posisi cursor sampai saat ini, 
        | sampai akhir kata ke-N. Setelah itu manambah karakter.
*C*     | Masuk ke *insert mode*, mengganti karakter dari posisi cursor sampai saat ini, 
        | sampai akhir baris. Setelah itu manambah karakter.   

*Insert mode* akan berakhir setelah tombol *Esc* ditekan.

### Menghapus karakter

Tombol            | Keterangan
----------------- | :---------------------
*cc*              | Masuk ke *insert mode*, menghapus seluruh karakter pada baris cursor saat ini.
*Ncc* atau *cNc*  | Masuk ke *insert mode*, menghapus seluruh karakter sampai N baris,
                  | dimulai dari baris cursor saat ini.
*x*               | menghapus karakter dibawah cursor.
*Nx*              | menghapus N karakter, dimulai dari karakter dibawah cursor.
*dw*              | menghapus seluruh karakter pada satu kata, dimulai dari karakter dibawah cursor.
*D*               | menghapus seluruh karakter hingga akhir baris, dimulai dari karakter dibawah cursor.
*dd*              | menghapus seluruh karakter pada baris cursor saat ini.
*Ndd*             | menghapus seluruh karakter sampai N baris, dimulai dari baris cursor saat ini.

### Copy/Paste

Tombol            | Keterangan
----------------- | :---------------------
*yy*              | Copy keseluruhan baris dari cursor saat ini.
*Nyy* atau *yNy*  | Copy N baris dimulai dari baris cursor saat ini.
*p* atau *P*      | Paste

## Undo/Redo

Notepad ++             | vi      | Keterangan 
-----------------------|:--------|:--------------------------------------
*Ctrl*+*z*, *Ctrl*+*y* | *u*     | toggle undo dan redo operasi terakhir.
                       | *U*     | toggle undo dan redo pada keseluruhan perubahan pada satu baris.	

## Find

Notepad ++                                    | vi                             
----------------------------------------------|:---------------------------------------------
*Ctrl*+*f*, kemudian muncul window,           | Ketik */* diikuti kata pencarian untuk 
pilih *direction*, dan masukkan kata          | mencari dengan direction Down.
pencarian.                                    | Ketik *?* diikuti kata pencarian untuk  
                                              | mencari dengan direction Up.
*F3*                                          | n
*Shift*+*F3*                                  | N

## Operasi File

Notepad++          | vi                        | Keterangan
------------------ | :------------------------ | :-------------------------- 
*Ctrl*+*s*         | :w                        | Save
*Ctrl*+*Alt*+*s*   | :w namafilebaru.txt       | Save as...
                   | :wq atau :x               | Save and close
                   | :w! filelain.txt          | Save dan timpa filelain.txt
                   | :n,Nw filekecil.txt       | Save baris dari n sampai N dengan nama filekecil.txt
*Ctrl*+*w*         | :q                        | Quit (gagal jika ada perubahan yang belum di save)
                   | :q!                       | Quit (dan membiarkan perubahan yang belum di save)

## Lainnya

 - *Ctrl*+*l* (redraws the screen)
 - *Ctrl*+*r* (redraws the screen, removing deleted lines)
 - *:.=*	(returns line number of current line at bottom of screen)
 - *:=*	(returns the total number of lines at bottom of screen)
 - *Ctrl*+*g* (provides the current line number, along with the total number of lines, in the file at the bottom of the screen)


## Referrensi
 - http://www.cs.colostate.edu/helpdocs/vi.html