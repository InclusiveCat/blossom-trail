import re, json

with open('form_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'var FB_PUBLIC_LOAD_DATA_ = (\[.*?\]);\n', html)
if m:
    data = json.loads(m.group(1))
    for item in data[1][1]:
        if item[4]:
            print(f"{item[1]}: entry.{item[4][0][0]}")
