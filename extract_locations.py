import re
import json

with open("map.html", "r", encoding="utf-8") as f:
    content = f.read()

def extract_array(var_name):
    # Find var var_name = [...];
    match = re.search(rf'var\s+{var_name}\s*=\s*(\[.*?\]);', content, re.DOTALL)
    if match:
        arr_str = match.group(1)
        # It has single quotes, unquoted keys, etc. Let's use ast.literal_eval if possible.
        # But since it's JS, keys might not be quoted. We will use a regex to add quotes.
        arr_str = re.sub(r'([{,]\s*)([a-zA-Z0-9_]+)\s*:', r'\1"\2":', arr_str)
        arr_str = arr_str.replace("'", '"')
        try:
            return json.loads(arr_str)
        except json.JSONDecodeError as e:
            print(f"Error parsing {var_name}: {e}")
            return []
    return []

backupHubs = extract_array("backupHubs")
sites = extract_array("sites")
stages = extract_array("stages")

# Note: stages contains \u2018 which json.loads can handle, but wait, there might be other issues.
# For stages, technique has HTML which might have quotes.

data = {
    "backupHubs": backupHubs,
    "sites": sites,
    "stages": stages
}

with open("data/locations.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    print("locations.json written.")
