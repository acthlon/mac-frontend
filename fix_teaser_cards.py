import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# --- StyleFinderTeaserCard adjustments ---
f = re.sub(
    r'className={`rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6',
    r'className={`rounded-xl sm:rounded-2xl border p-4 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6',
    f
)
f = re.sub(
    r'className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-\[#FFB400\]/15 \ntext-\[#FFB400\]"',
    r'className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#FFB400]/15 text-[#FFB400]"',
    f
)
f = re.sub(
    r'className={`font-display text-2xl font-semibold mt-0\.5 \$\{isDark \? "text-white" : "text-\[#141414\]"}`}',
    r'className={`font-display text-lg sm:text-2xl font-semibold mt-0.5 ${isDark ? "text-white" : "text-[#141414]"}`}',
    f
)
f = re.sub(
    r'className={`font-sans text-xs mt-1 \$\{isDark \? "text-white/60" : "text-neutral-600"}`}',
    r'className={`font-sans text-[10px] sm:text-xs mt-1 ${isDark ? "text-white/60" : "text-neutral-600"}`}',
    f
)
f = re.sub(
    r'className="flex shrink-0 items-center gap-2 rounded-xl bg-\[#FFB400\] px-5 py-3 font-sans text-xs font-bold \ntext-\[#0F0F0F\] transition-transform hover:scale-105 shadow-md shadow-\[#FFB400\]/20"',
    r'className="flex shrink-0 items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#FFB400] px-4 py-2 sm:px-5 sm:py-3 font-sans text-[10px] sm:text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md shadow-[#FFB400]/20 w-full sm:w-auto justify-center"',
    f
)

# --- LookbookTeaserCard adjustments ---
f = re.sub(
    r'className="mx-auto mt-14 max-w-7xl px-4 sm:px-8"',
    r'className="mx-auto mt-8 sm:mt-14 max-w-7xl px-4 sm:px-8"',
    f
)
f = re.sub(
    r'className={`relative overflow-hidden rounded-3xl border shadow-xl transition-all duration-300 group \$\{',
    r'className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xl transition-all duration-300 group ${',
    f
)
f = re.sub(
    r'className="p-8 sm:p-10 flex flex-col items-start gap-3"',
    r'className="p-5 sm:p-10 flex flex-col items-start gap-2 sm:gap-3"',
    f
)
f = re.sub(
    r'className="inline-flex items-center gap-1\.5 rounded-full border border-\[#FFB400\]/40 \nbg-\[#FFB400\]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-\[0\.2em\] text-\[#FFB400\]"',
    r'className="inline-flex items-center gap-1.5 rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-2 py-0.5 sm:px-3 sm:py-1 font-sans text-[8px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]"',
    f
)
f = re.sub(
    r'className={`font-display text-3xl sm:text-4xl font-semibold \$\{isDark \? "text-white" : \n"text-\[#141414\]"`}',
    r'className={`font-display text-xl sm:text-4xl font-semibold ${isDark ? "text-white" : "text-[#141414]"}`}',
    f
)
f = re.sub(
    r'className={`font-sans text-xs sm:text-sm leading-relaxed \$\{isDark \? "text-white/65" : \n"text-neutral-600"`}',
    r'className={`font-sans text-[10px] sm:text-sm leading-relaxed ${isDark ? "text-white/65" : "text-neutral-600"}`}',
    f
)
f = re.sub(
    r'className="mt-2 flex items-center gap-2 rounded-xl bg-\[#FFB400\] px-6 py-3\.5 font-sans text-xs \nfont-bold text-\[#0F0F0F\] transition-transform hover:scale-105 shadow-lg shadow-\[#FFB400\]/20"',
    r'className="mt-1 sm:mt-2 flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#FFB400] px-4 py-2 sm:px-6 sm:py-3.5 font-sans text-[10px] sm:text-xs font-bold text-[#0F0F0F] transition-transform hover:scale-105 shadow-md sm:shadow-lg shadow-[#FFB400]/20 w-full sm:w-auto justify-center"',
    f
)
f = re.sub(
    r'className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900"',
    r'className="relative h-48 sm:h-80 w-full overflow-hidden bg-neutral-900"',
    f
)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
