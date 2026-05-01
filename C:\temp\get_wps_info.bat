@echo off
C:
cd \
reg query HKCU\Software\Kingsoft\Office\6.0\wps /s > C:\temp\wps_reg.txt 2>&1
reg query HKCU\Software\Kingsoft\Office\6.0\et /s > C:\temp\et_reg.txt 2>&1
reg query HKCU\Software\Kingsoft\Office\6.0\wpp /s > C:\temp\wpp_reg.txt 2>&1
reg query HKCU\Software\Kingsoft\Office\6.0\common /s > C:\temp\common_reg.txt 2>&1
dir /b C:\Users\31232\AppData\Roaming\Microsoft\Windows\Recent\*.lnk > C:\temp\recent_files.txt 2>&1
dir /a /d E:\ > C:\temp\e_drive.txt 2>&1
dir /s /b C:\Users\31232\AppData\Roaming\Kingsoft\office6\backup > C:\temp\wps_backup.txt 2>&1
reg query HKCU\Software\Kingsoft\Office\6.0\Common\RecentItems /s > C:\temp\recent_items.txt 2>&1
reg query HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs > C:\temp\recent_docs.txt 2>&1
echo DONE > C:\temp\done.txt
