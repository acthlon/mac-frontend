import re

f = open('src/pages/OrderDetailsPage.jsx').read()

f = f.replace('import React, { useState } from "react";\n', '')
f = f.replace('import { Link, useParams } from "react-router-dom";', 'import { Link } from "react-router-dom";')

icons = ["Search", "User", "ShoppingCart", "Menu", "ChevronDown", "ShieldCheck", "Headset"]
for icon in icons:
    f = re.sub(r'\b' + icon + r',\s*', '', f)
    f = re.sub(r',\s*\b' + icon + r'\b', '', f)

open('src/pages/OrderDetailsPage.jsx', 'w').write(f)
