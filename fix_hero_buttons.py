import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

def safe_replace(pattern, replacement, text):
    pattern = re.sub(r' +', r'\\s+', pattern)
    return re.sub(pattern, replacement, text)

# Let's replace the first button
f = safe_replace(
    'className="rounded-lg sm:rounded-xl bg-[#FFB400] px-2.5 py-1 sm:px-6 sm:py-3 font-sans text-[9px] sm:text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-sm sm:shadow-lg shadow-[#FFB400]/20"',
    'className="rounded sm:rounded-xl bg-[#FFB400] px-2 py-0.5 sm:px-6 sm:py-3 font-sans text-[8px] sm:text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-sm sm:shadow-lg shadow-[#FFB400]/20"',
    f
)

# And the second button
f = safe_replace(
    'className="rounded-lg sm:rounded-xl border border-white/20 bg-white/5 px-2.5 py-1 sm:px-6 sm:py-3 font-sans text-[9px] sm:text-sm font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400]"',
    'className="rounded sm:rounded-xl border border-white/20 bg-white/5 px-2 py-0.5 sm:px-6 sm:py-3 font-sans text-[8px] sm:text-sm font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400]"',
    f
)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
