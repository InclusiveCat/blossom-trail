import os

filepath = r"c:\Users\andre\projects\blossom-trail\survey.html"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    "entry.797108725": "gender",
    "entry.1349130532": "gender_selfdescribe",
    "entry.429384339": "age",
    "entry.320659026": "council",
    "entry.751986915.other_option_response": "current_situation.other_option_response",
    "entry.751986915": "current_situation",
    "entry.752149719": "feelings_last_4_weeks",
    "entry.1437769659": "sensory_alignment",
    "entry.1712510494": "sustainable_activities",
    "entry.1609008989": "energy_drain_tasks",
    "entry.744626225": "strengths",
    "entry.249581486": "digital_tools_effective",
    "entry.1069785642": "unmet_needs",
    "entry.217683421": "additional_help",
    "entry.1218629302": "services_understand_burnout",
    "entry.659943046": "services_working_well",
}

for old, new in replacements.items():
    content = content.replace(old, new)

content = content.replace('name="entry.1014958432" id="uuid_field"', 'id="uuid" name="blossom_uuid"')

old_js = """        let uuid = localStorage.getItem('blossom_survey_uuid');
        if (!uuid) {
            uuid = generateUUID();
            localStorage.setItem('blossom_survey_uuid', uuid);
        }
        document.getElementById('uuid_field').value = uuid;"""

new_js = """        let generatedUUID = localStorage.getItem('blossom_survey_uuid');
        if (!generatedUUID) {
            generatedUUID = generateUUID();
            localStorage.setItem('blossom_survey_uuid', generatedUUID);
        }
        document.getElementById("uuid").value = generatedUUID;"""

content = content.replace(old_js, new_js)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully.")
