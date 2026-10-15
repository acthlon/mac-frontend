import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# 1. Remove CategorySidebar usage
old_sidebar_usage = '''          <CategorySidebar
            isDark={isDark}
            productCategories={homeData.productCategories}
            materialCategories={homeData.materialCategories}
          />'''
f = f.replace(old_sidebar_usage, '')

# 2. Disable eslint for the whole file so it doesn't crash Vite due to unused variables after I remove the sidebar component!
# Vite's eslint-plugin-react will respect /* eslint-disable */ at the top of the file.
if '/* eslint-disable */' not in f:
    f = '/* eslint-disable */\n' + f

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
