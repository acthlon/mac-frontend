import re

f = open('src/pages/HomePage.jsx').read()

f = f.replace(', Instagram as InstagramIcon, Facebook as FacebookIcon } from "lucide-react";', ' } from "lucide-react";')

open('src/pages/HomePage.jsx', 'w').write(f)
