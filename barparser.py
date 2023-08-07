import html
import re

t = None
with open('likvaltmp', 'r') as f:
	t = f.read().strip()

sec = html.unescape(max(re.findall('`[^`]*`', t), key=len)[1:-1])

print(sec)
