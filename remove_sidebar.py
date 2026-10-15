import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# Replace the specific CategorySidebar JSX with empty string
f = f.replace('''          <CategorySidebar
            isDark={isDark}
            productCategories={homeData.productCategories}
            materialCategories={homeData.materialCategories}
          />''', '')

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
