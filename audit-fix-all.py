import os
import subprocess
import re
import json

cwd = os.getcwd()
dirs = (d.name for d in os.scandir(cwd) if d.is_dir() and d.name[0] != '.')

for d in dirs:
  os.chdir(d)
  subprocess.run('npm audit fix', shell=True)
  with open('package.json', 'r+') as f:
    pattern = re.compile(r'("version": "\d+\.\d+\.)(\d+)(")')
    fileContent = f.read()
    match = pattern.search(fileContent)
    nextMinorVersionNumber = str(int(match.group(2)) + 1)
    updatedContent = re.sub(pattern, match.group(1) + nextMinorVersionNumber + match.group(3), fileContent)
    f.seek(0)
    f.write(updatedContent)
    f.truncate()
  subprocess.run('npm run publish', shell=True)
  os.chdir('..')




      

    
