import re

f = open('src/components/catalog/ItemCard.jsx', encoding='utf-8').read()

# Remove list view button
list_btn = r'<button\s*type="button"\s*onClick=\{\(\) => addToCart\(item\)\}\s*className="flex items-center gap-2 rounded-lg bg-\[#FFB400\] px-4 py-2 font-sans text-xs font-semibold\s*text-\[#0F0F0F\] transition-transform hover:scale-105"\s*>\s*<ShoppingBag size=\{15\} />\s*Add to Bag\s*</button>'
f = re.sub(list_btn, '', f, flags=re.MULTILINE)

# Remove grid view button
grid_btn = r'<button\s*type="button"\s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*addToCart\(item\);\s*\}\}\s*aria-label=\{`Add \$\{item\.name\} to bag`\}\s*className="absolute bottom-3 right-\[3\.25rem\] z-10 flex h-9 w-9 items-center justify-center rounded-full\s*bg-\[#FFB400\] text-\[#0F0F0F\] transition-transform duration-200 hover:scale-105 shadow-md"\s*>\s*<ShoppingBag size=\{16\} />\s*</button>'
f = re.sub(grid_btn, '', f, flags=re.MULTILINE)

open('src/components/catalog/ItemCard.jsx', 'w', encoding='utf-8').write(f)
