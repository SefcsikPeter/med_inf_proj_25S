## Summary

This repository contains the code for the epidemiology learning application, which was created as part of the Project in Medical Informatics 2025S.

## Installer

The main purpose of this repository is to demonstrate how the application works. The application itself can be installed using the installer contained within this Google Drive folder:
https://drive.google.com/drive/folders/1t8XNVfiBc3EmE315Tp2VH8ICo547j0tw?usp=sharing

For now, the installer is only compatible with Windows devices.
After running the installer, the application starts automatically. This process may take a while the first time.
The installer creates a desktop shortcut called 'Infection Visualiser'. This can later be used to start the application without the installer, and to locate the folder containing all the application's data and the uninstaller.

## Requirements
Due to the inclusion of numerous assets and a fully packaged Python environment with preinstalled libraries, the application requires around **2 GB** of storage.

This application is a web-based system bundled as a desktop executable using Electron. As a result, it runs a local server and requires the following ports to be available on the host machine:

- Port **8000** – Used by the backend server (Python)
- Port **4200** – Used by the frontend interface (Angular)

