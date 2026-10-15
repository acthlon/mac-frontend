import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# I will use re.sub but I will PROPERLY escape the regex literal!

def escape_and_space(text):
    # Escape regex specials
    text = re.escape(text)
    # Replace escaped spaces with \s+ to handle newlines
    text = text.replace(r'\ ', r'\s+')
    return text

# Lookbook tag
f = re.sub(
    escape_and_space('className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]"'),
    'className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-2 py-0.5 sm:px-3 sm:py-1 font-sans text-[8px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]"',
    f
)

# Lookbook H2
f = re.sub(
    escape_and_space('className={`font-display text-3xl sm:text-4xl font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}'),
    'className={`font-display text-2xl sm:text-4xl font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}',
    f
)

# Lookbook P
f = re.sub(
    escape_and_space('className={`font-sans text-xs sm:text-sm leading-relaxed ${isDark ? "text-white/65" : "text-neutral-600"}`}'),
    'className={`font-sans text-[10px] sm:text-sm leading-relaxed ${isDark ? "text-white/65" : "text-neutral-600"}`}',
    f
)

# Lookbook button
f = re.sub(
    escape_and_space('className="mt-2 flex items-center gap-2 rounded-xl bg-[#FFB400] px-6 py-3.5 font-sans text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-lg shadow-[#FFB400]/20"'),
    'className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#FFB400] px-4 py-2 sm:px-6 sm:py-3.5 font-sans text-[10px] sm:text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md sm:shadow-lg shadow-[#FFB400]/20 w-full sm:w-auto justify-center"',
    f
)

# StyleFinder tag
f = re.sub(
    escape_and_space('className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#FFB400]"'),
    'className="font-sans text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-[#FFB400]"',
    f
)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
