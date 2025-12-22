# Install Gitolite di Localhost

## Pendahuluan

Git adalah tools yang powerfull untuk menyimpan revisi dan versioning file text.

Git tidak terdapat fitur otentikasi dan fitur otorisasi. Kedua fitur tersebut
inherit kepada file sistem dan service di sistem operasi.

Ketika membutuhkan kolaborasi dengan multi user, maka software wrapper git dibutuhkan.

Salah satu yang sederhana adalah gitolite. Menyediakan fitur otorisasi terhadap
repository.

Gitolite akan memanage git lainnya dengan menggunakan configuration yang juga
di-control melalui git.

Git control git.

## Persiapan Pair Key

Kita siapkan ssh pair key dengan command `ssh-keygen`.

Mesin yang digunakan adalah localhost dengan sistem operasi Linux.

Bagi pengguna Windows, Linux dapat dimainkan melalui [Cygwin][1] maupun [WSL2][2].

[1]: /blog/2017/01-28-windows-rasa-linux-cygwin-openssh-server.md

[2]: /blog/2021/03-06-berkenalan-dengan-windows-subsytem-of-linux-wsl.md

User reguler Linux yang digunakan pada tulisan kali ini adalah `ijortengab`.

Siapkan public key.

```
ssh-keygen
```

atau sat set tanpa prompt.

```
[ -f ~/.ssh/id_rsa ] || ssh-keygen -t rsa -f ~/.ssh/id_rsa -q -P ""
```

Public key biasanya ber-extension `.pub`. Kita letakkan di memory.

```
pathfile="/dev/shm/ijortengab.pub"
cp ~/.ssh/id_rsa.pub $pathfile
```

## Persiapan User Hosting

User hosting yang akan digunakan untuk memanage repository git perlu dibuat dulu.

User hosting adalah user reguler linux yang sama dengan user `ijortengab`.

Kita gunakan nama user hosting yang umum yakni `git`.

Login sebagai root.

```
su -
```

atau

```
sudo su
```

Pastikan aplikasi git exists atau install.

```
apt install git -y
```

Buat user reguler Linux bernama `git`.

```
adduser git
```

atau tanpa prompt.

```
adduser --gecos "" --disabled-password git
```

atau jika home direktori ingin diubah menjadi /var/git,
kita bisa membuat user dengan binary `useradd` alih-alih perl script `adduser`.

```
useradd --home-dir /var/git --create-home git
```

Login sebagai git.

```
su - git
```

Verifikasi dengan `whoami` dan `pwd`

```
whoami
cd
pwd
```

## Persiapan Binary Directory Local

Kita akan menggunakan local directory binary yakni `$HOME/bin` sebagai lokasi
binary `gitolite`.

Cek pada PATH.

```
export | grep PATH
```

Jika direktori tidak tersedia, maka edit file `.profile`.

```
vi ~/.profile
```

Jika value seperti dibawah ini tidak exists, maka append:

```
# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi
```

Lalu buat direktori nya

```
mkdir -p ~/bin
```

Login ulang shell sehingga PATH akan berubah, atau eksekusi ulang:

```
PATH="$HOME/bin:$PATH"
```

Verifikasi lagi:

```
export | grep PATH
```

Pastikan terdapat value `$HOME/bin` pada variable PATH.

Contoh output:

```
export PATH='/var/git/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games'
```

## Install

Berkunjung ke halaman [Quick Install](https://gitolite.com/gitolite/quick_install.html).

Langsung praktek.

```
git clone https://github.com/sitaramc/gitolite
```

Masuk ke direktori.

```
cd gitolite
```

Install command `gitolite` dari direktori repository tersebut.

```
./install -ln $HOME/bin
```

Pastikan command `gitolite` exists.

```
which gitolite
```

Set lokasi public key sebagai variable.

```
pathfile="/dev/shm/ijortengab.pub"
```

Mulai setup.

```
gitolite setup -pk $pathfile
```

Tercipta dua repository bare di alamat `$HOME/repositories/gitolite-admin.git`
dan `$HOME/repositories/testing.git`.

Selesai.

## Praktek Membuat Remote Repository

Login sebagai user reguler.

```
su - ijortengab
```

clone repositories.

```
cd
git clone git@localhost:gitolite-admin.git
```

Kita akan tambahkan bare repository beralamat di `$GL_REPO_BASE/ijortengab/blog`.

Secara default variable `$GL_REPO_BASE` adalah `$HOME/repositories` dimana `$HOME`
adalah home direktori dari user `git`.

Masuk ke direktori.

```
cd gitolite-admin
```

Append value sebagai berikut:

```
cat <<-EOF >> conf/gitolite.conf

repo ijortengab/blog
    RW+     =   ijortengab
EOF
```

Commit dan Push.

```
git add conf/gitolite.conf
git commit -m "Add repository ijortengab/blog."
git push origin master
```

Output yang muncul terdapat informasi sebagai berikut:

```
remote: Initialized empty Git repository in /var/git/repositories/ijortengab/blog.git/
```

## Validasi

Clone repository dari Github.

```
cd
git clone https://github.com/ijortengab/blog
```

Masuk ke direktori.

```
cd blog
```

Secara default, remote repository Github akan bernama `origin`.

```
git remote -v
```

Output:

```
origin  https://github.com/ijortengab/blog (fetch)
origin  https://github.com/ijortengab/blog (push)
```

Tambakan repository yang dibuat gitolite.

```
git remote add local git@localhost:ijortengab/blog
```

Verifikasi.

```
git remote -v
```

Output:

```
local   git@localhost:ijortengab/blog (fetch)
local   git@localhost:ijortengab/blog (push)
origin  https://github.com/ijortengab/blog (fetch)
origin  https://github.com/ijortengab/blog (push)
```

Push ke Gitolite.

```
git push local master
```

Output.

```
Enumerating objects: 1376, done.
Counting objects: 100% (1376/1376), done.
Delta compression using up to 2 threads
Compressing objects: 100% (580/580), done.
Writing objects: 100% (1376/1376), 2.72 MiB | 13.15 MiB/s, done.
Total 1376 (delta 758), reused 1364 (delta 750), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (758/758), done.
To localhost:ijortengab/blog
 * [new branch]      master -> master
```

Berhasil.

## Github

Disarankan untuk menggunakan ssh pair key untuk beroperasi dengan repository di
Github.

Kita ubah remote repository Github dari sebelumnya
`https://github.com/ijortengab/blog` menjadi `git@github.com:ijortengab/blog`.

```
git remote set-url origin git@github.com:ijortengab/blog
```

Verifikasi ulang.

```
git remote -v
```

Output:

```
local   git@localhost:ijortengab/blog (fetch)
local   git@localhost:ijortengab/blog (push)
origin  git@github.com:ijortengab/blog (fetch)
origin  git@github.com:ijortengab/blog (push)
```

## Referensi

https://docs.github.com/en/authentication/connecting-to-github-with-ssh

https://cafeduvesper.net/notes/replacing-gitea-with-gitolite

https://wiki.php.net/systems/git
