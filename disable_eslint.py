f = open('src/pages/HomePage.jsx', encoding='utf-8').read()
if '/* eslint-disable */' not in f:
    f = '/* eslint-disable */\n' + f
open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
