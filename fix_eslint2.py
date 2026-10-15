import re

f = open('src/pages/HomePage.jsx').read()

unused_icons = ['ShoppingBag', 'Eye', 'Star', 'ArrowRight', 'Search', 'Heart', 'Headset', 'Ruler', 'Lock', 'BadgeCheck', 'Quote']

for icon in unused_icons:
    f = re.sub(r'\b' + icon + r'\b,\s*', '', f)
    f = re.sub(r',\s*\b' + icon + r'\b', '', f)

f = re.sub(r'\bfunction FeatureStrip.*?}\n', '', f, flags=re.DOTALL)

open('src/pages/HomePage.jsx', 'w').write(f)
