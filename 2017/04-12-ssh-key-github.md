---
title: SSH Key untuk koneksi ke Github tanpa Password
# draft: true
---

## Pendahuluan

Sebuah project mempunyai repository di github.com. Saat akan di-push:

```
git push origin master
```

Muncul dialog input untuk memasukkan username dan password.

```
ijortengab@server:~/project$ git push origin master
Username for 'https://github.com':
```

Bagaimanakan caranya agar input username/password tersebut dapat dilewati?

> SSH Key jawabannya.


## Generating a new SSH key

Bila tidak ada `id_rsa`, atau mau menggunakan key lainnya, create!

```
ijortengab@server:~$ ls ~/.ssh
ls: cannot access /home/ijortengab/.ssh: No such file or directory
ijortengab@server:~$
```

Gunakan command berikut:

```
ssh-keygen -t rsa -b 4096
```

atau

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

```
ijortengab@server:~$ ssh-keygen -t rsa -b 4096
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ijortengab/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/ijortengab/.ssh/id_rsa.
Your public key has been saved in /home/ijortengab/.ssh/id_rsa.pub.
The key fingerprint is:
aa:bb:cc:dd:ee:ff:gg:hh:ii:jj:kk:ll:mm:nn:oo:pp ijortengab@server
The key's randomart image is:
+--[ RSA 4096]----+
|                 |
|                 |
|                 |
|                 |
|      . S        |
|       +         |
|      . .        |
|  ..o.E.oo       |
| .=B*B=X=+.      |
+-----------------+
ijortengab@server:~$
```

## Adding your SSH key to the ssh-agent

Start the ssh-agent in the background.

```
ijortengab@server:~$ eval "$(ssh-agent -s)"
Agent pid 19224
```

Add your SSH private key to the ssh-agent.

(Nama file disesuaikan dengan nama yang didaftarkan saat create ssh key.)

```
ssh-add ~/.ssh/id_rsa
```

Jika key dibuat dengan passphrase, maka muncul dialog input.

```
Enter passphrase for /home/<user>/.ssh/id_rsa:
Identity added: /home/<user>/.ssh/id_rsa (/home/<user>/.ssh/id_rsa)
```

## Adding a new SSH key to your GitHub account

Masuk ke site:

<https://github.com/settings/keys>

Create New Key.

<img cloudinary="ijortengab.id/screenshot.720.edited.png">

Title:

```
Machine of ijortengab.id
```

Copy isi dari `id_rsa.pub`.

(Nama file disesuaikan dengan nama yang didaftarkan saat create ssh key.)

```
cat ~/.ssh/id_rsa.pub
```

Pastekan di field Key.

<img cloudinary="ijortengab.id/screenshot.721.edited.png">

Tekan tombol [Add SSH key], dan akan muncul input-an password.


<img cloudinary="ijortengab.id/screenshot.723.png">

## Testing your SSH connection

```
ssh -T git@github.com
```

```
ijortengab@server:~$ ssh -T git@github.com
Hi ijortengab! You've successfully authenticated, but GitHub does not provide shell access.
```

## Repository harus ssh

Masuk ke direktori project.

```
cd ~/ijortengab.id
git remote -v
```

```
ijortengab@server:~/ijortengab.id$ git remote -v
origin  https://github.com/ijortengab/ijortengab.id.git (fetch)
origin  https://github.com/ijortengab/ijortengab.id.git (push)
```

Ganti dari `https` ke `ssh`.

```
git remote set-url origin git@github.com:ijortengab/ijortengab.id
```

```
ijortengab@server:~/ijortengab.id$ git remote -v
origin  git@github.com:ijortengab/ijortengab.id (fetch)
origin  git@github.com:ijortengab/ijortengab.id (push)
```

## Praktek

Edit project, add, commit.

Kemudian push ke repository, maka push akan berlanjut tanpa perlu input password lagi.

```
ijortengab@server:~/ijortengab.id$ git commit -m "update draft"
[master 456e5e8] update draft
 1 file changed, 408 insertions(+)
 create mode 100644 source/_posts/2017-04-11-install-drupal-8-vps.md
ijortengab@server:~/ijortengab.id$ git push origin master
Counting objects: 8, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (5/5), done.
Writing objects: 100% (5/5), 3.78 KiB | 0 bytes/s, done.
Total 5 (delta 3), reused 0 (delta 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To git@github.com:ijortengab/ijortengab.id
   b6711b5..456e5e8  master -> master
ijortengab@server:~/ijortengab.id$
```

## Reference

https://help.github.com/articles/generating-an-ssh-key/

https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/

https://help.github.com/articles/working-with-ssh-key-passphrases/

https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/

https://help.github.com/articles/testing-your-ssh-connection/
