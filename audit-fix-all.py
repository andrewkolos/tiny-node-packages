import os
import subprocess
import re

cwd = os.getcwd()
dirs = (d.name for d in os.scandir(cwd) if d.is_dir() and d.name[0] != '.')

for d in dirs:
    os.chdir(d)
    auditResult = subprocess.run(
        'npm audit fix', shell=True, capture_output=True, text=True, check=True)
    if auditResult.stdout.find('fixed 0 of 0 vulnerabilities'):
        os.chdir('..')
        continue
    with open('package.json', 'r+') as f:
        pattern = re.compile(r'("version": "\d+\.\d+\.)(\d+)(")')
        fileContent = f.read()
        match = pattern.search(fileContent)
        nextMinorVersionNumber = str(int(match.group(2)) + 1)
        updatedContent = re.sub(pattern, match.group(
            1) + nextMinorVersionNumber + match.group(3), fileContent)
        f.seek(0)
        f.write(updatedContent)
        f.truncate()
    subprocess.run('npm run pub', shell=True, check=True)
    os.chdir('..')
