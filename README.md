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

<img width="1107" height="610" alt="help" src="https://github.com/user-attachments/assets/1e88e657-a57e-4508-8de6-9843329377c8" />

- `dn --nls` : For view your reminder item list.

- `dn --ne` : For enable all reminder.

- `dn --nd` : For disable all reminder.

- `dn --nad "Text1{02:00|Text2{03:00"` : For add new reminder item(s).

- `dn --nus "1{Done|3{Done"` : For update reminder item(s) status ['Active','Done'] (Recommend steps : first disable reminder, update status then enable reminder).

- `dn --nud "1{00:01|3{00:10"` : For update reminder item(s) duration (Recommend steps : first disable reminder, update duration then enable reminder).

- `dn --nui [LOCAL SYSTEM IMAGE PATH]` : For update reminder icon image (Recommend steps : first disable reminder, update icon image then enable reminder).
