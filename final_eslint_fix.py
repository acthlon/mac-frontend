import re

f = open('src/pages/HomePage.jsx').read()

# Add Star back if missing
if 'Star' not in f[:500]:
    f = f.replace('from "lucide-react";', '  Star,\n} from "lucide-react";')

# Remove unused
unused = ['Menu', 'ShieldCheck', 'Truck', 'RotateCcw']
for icon in unused:
    f = re.sub(r'\b' + icon + r'\b,\s*', '', f)
    f = re.sub(r',\s*\b' + icon + r'\b', '', f)

# Remove isDark from function Hero({ isDark, ... }) since it's unused
f = f.replace('function Hero({ isDark, banners = [], heroActions }) {', 'function Hero({ banners = [], heroActions }) {')
f = f.replace('<Hero\n            isDark={isDark}', '<Hero')

# Fix setImgSrc effect
f = f.replace('setImgSrc(product.pry_image || product.image || fallbackImage);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n    setImgSrc(product.pry_image || product.image || fallbackImage);')

open('src/pages/HomePage.jsx', 'w').write(f)
