import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# Primary button
f = re.sub(
    r'className="rounded-xl bg-\[#FFB400\] px-3 py-1\.5 sm:px-6 sm:py-3 font-sans text-\[10px\] sm:text-sm font-semibold text-\[#0F0F0F\] transition-transform duration-200 hover:scale-105 shadow-md sm:shadow-lg shadow-\[#FFB400\]/20"',
    'className="rounded-lg sm:rounded-xl bg-[#FFB400] px-2.5 py-1 sm:px-6 sm:py-3 font-sans text-[9px] sm:text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-sm sm:shadow-lg shadow-[#FFB400]/20"',
    f
)

# Secondary button
f = re.sub(
    r'className="rounded-xl border border-white/20 bg-white/5 px-3 py-1\.5 sm:px-6 sm:py-3 font-sans text-\[10px\] sm:text-sm font-semibold text-white transition-all hover:border-\[#FFB400\] hover:bg-\[#FFB400\]/10 hover:text-\[#FFB400\]"',
    'className="rounded-lg sm:rounded-xl border border-white/20 bg-white/5 px-2.5 py-1 sm:px-6 sm:py-3 font-sans text-[9px] sm:text-sm font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400]"',
    f
)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
