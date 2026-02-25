import subprocess
import os

os.chdir("/vercel/share/v0-project")

result = subprocess.run(
    ["npm", "install", "--package-lock-only"],
    capture_output=True,
    text=True
)

print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("Return code:", result.returncode)
