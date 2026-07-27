# Day to day windows reminder cli

CLI for handling custom day to day reminder task/text by native notifications using Node.js. Toasters for Windows 8/10, or taskbar balloons for earlier Windows versions.

## Installation

```bash
npm install -g d2dwin-reminder-cli
```

[If you see an EACCES error when you try to install a package globally.](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

VERIFY package : Use `npm list --global --depth=0` command to lists all installed global packages.

### Manually steps for set the installed package as auto executable.

- `GET Path` : Use `npm config get prefix` Prints the path where global executable binaries are linked.
- `BATCH file` : Open notepad and copy and paste blow code into your empty notepad window and name your file and end it with `.bat`, save it.

  ```bash
  @echo off
  call "[GET Path]\dn.cmd"
  ```

- `VB Script` : Open notepad and copy and paste blow code into your empty notepad window and name your file and end it with `.vbs`, save it.

  ```bash
  CreateObject("Wscript.Shell").Run "cmd /c [BATCH File path]", 0, False
  ```

- `SET [VB Script] file as startup applications` : [Configure Startup applications in Windows](https://support.microsoft.com/en-us/windows/experience/startup-boot/configure-startup-applications-in-windows) follow the steps & configure [VB Script] file & restart the PC.

## Quick Start

- `dn --help` : For all available options.

<img width="1690" height="934" alt="help" src="https://github.com/user-attachments/assets/5bac93e0-c66a-4de6-ae4e-c1bb9fee7b16" />

- `dn --nls` : For view your reminder item list.

- `dn --ne` : For enable all reminder.

- `dn --nd` : For disable all reminder.

<img width="1348" height="273" alt="nudi" src="https://github.com/user-attachments/assets/b960c67f-54ea-4461-8a6b-b26288d48a77" />


- `dn --nad` : For add new reminder item(s). (each item separate by '|||').

  > *NOTE :
  > To prevent internal double quotes from breaking a string, you must wrap the text inside single quotes (' ').

  > [ Text{HH:MM{'A' | 'T' ]
  >
  > 'A' | 'a' : To launch and run an executable command(s) using the Windows Command Prompt
  >
  > 'T' | 't' : Notification reminder

  > Example:

  > Notification reminder :
  >
  > ```bash
  > dn --nad "Todo1{01:00{t|||Todo2{02:00"
  > ```

  > Windows Command Prompt : Launch and run an executable command(s)
  >
  > ```bash
  > dn --nad "ipconfig /all & ping google.com & netstat -an{00:30{a|||(ipconfig && ping google.com) || echo 'Network setup failed'{02:00{a"
  > ```

<img width="1350" height="619" alt="add" src="https://github.com/user-attachments/assets/d7e97838-1a54-4d59-ae35-3dc9e55b11dc" />


- `dn --nus` : For Update reminder item(s) status(Active | Done). (each item separate by '|||')

  > *Recommend steps : first disable reminder, update status then enable reminder.

  > [ Item Index{Updated Status ] : For Item index check `dn --nls` option.

  > Example:
  >
  > ```bash
  > dn --nus "1{Done|||2{Done|||3{Active"
  > ```

<img width="1346" height="461" alt="nus" src="https://github.com/user-attachments/assets/21a1dcfd-fc68-4e29-99d9-324b59f295f1" />


- `dn --nud` : For Update reminder item(s) duration(HH:MM). (each item separate by '|||')

  > *Recommend steps : first disable reminder, update duration then enable reminder.

  > [ Item Index{HH:MM ] : For Item index check `dn --nls` option.

  > Example:
  >
  > ```bash
  > dn --nud "1{00:30|||2{02:40|||3{04:09"
  > ```

<img width="1344" height="462" alt="nud" src="https://github.com/user-attachments/assets/2aae4bbf-8007-4153-87db-5d800c739c32" />


- `dn --nut` : For Update reminder item(s) type( 'A' | 'T' ). (each item separate by '|||')

  > *Recommend steps : first disable reminder, update type then enable reminder.

  > [ Item index{type( 'A' | 'T' ) ] : For Item index check `dn --nls` option.
  >
  > 'A' | 'a' : To launch and run an executable command(s) using the Windows Command Prompt
  >
  > 'T' | 't' : Notification reminder

  > Example:
  >
  > ```bsh
  > dn --nut "1{A|||2{T|||3{T"
  > ```

<img width="1341" height="460" alt="nut" src="https://github.com/user-attachments/assets/61506092-406c-4574-849b-c710e2077176" />


- `dn --nui [LOCAL SYSTEM IMAGE PATH]` : For update notification icon image.

  > *Recommend steps : first disable reminder, update icon image then enable reminder.

  > Allowed Extensions: '.jpg', '.jpeg', '.png'

<img width="1119" height="330" alt="nui" src="https://github.com/user-attachments/assets/ef2f7c6e-4523-48c3-ba37-aefe49c62a42" />
