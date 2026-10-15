import re

f = open('src/pages/HomePage.jsx').read()

f = re.sub(r'(?ms)const SIDEBAR_CATEGORIES = \[.*?\];', '', f)
f = re.sub(r'(?ms)const TOP_FEATURES = \[.*?\];', '', f)
f = re.sub(r'(?ms)const BOTTOM_FEATURES = \[.*?\];', '', f)
f = re.sub(r'(?ms)function FeatureStrip.*?^}\n', '', f)

f = re.sub(r'\bFilter\b,\s*', '', f)
f = re.sub(r',\s*\bFilter\b', '', f)
f = re.sub(r'\bFilterIcon\b,\s*', '', f)
f = re.sub(r',\s*\bFilterIcon\b', '', f)
f = re.sub(r'\bLayers\b,\s*', '', f)
f = re.sub(r',\s*\bLayers\b', '', f)

# Find where isDark is unused. It might be in some other component. Let's look for unction FeatureStrip or similar where isDark was passed. Oh, wait, I deleted FeatureStrip.
# Let's see what else has onQuickView unused.
# unction ShopByCategory({ isDark, productCategories, materialCategories, onQuickView }) { maybe?
f = re.sub(r'\bonQuickView\b,\s*', '', f)
f = re.sub(r',\s*\bonQuickView\b', '', f)

open('src/pages/HomePage.jsx', 'w').write(f)
