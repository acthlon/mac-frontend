import re

log_content = open('C:/Users/Ali Akintayo/.gemini/antigravity/brain/504693d4-0d7f-428d-98f2-def13d79e7f3/.system_generated/tasks/task-927.log', encoding='utf-8').read()

# Extract the output block
# Look for "Output:\n" and then the end of the file.
parts = log_content.split('Output:\n')
if len(parts) > 1:
    code = parts[1]
    # Remove the <SYSTEM_MESSAGE> stuff at the bottom if present
    code = code.split('\n\nThe following is a <SYSTEM_MESSAGE>')[0]
    # Save the file
    open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(code)
