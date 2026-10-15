import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# Image height to 180px
f = re.sub(
    r'className="h-\[240px\] w-full object-cover sm:h-\[460px\]"',
    'className="h-[180px] w-full object-cover sm:h-[460px]"',
    f
)

# Wrapper min-h to 180px and tighter gap/padding
f = re.sub(
    r'className="relative z-10 flex min-h-\[240px\] sm:min-h-\[460px\] max-w-md flex-col justify-center gap-2\s+sm:gap-3\.5 py-4 px-5 sm:py-10 sm:pl-20 sm:pr-10"',
    'className="relative z-10 flex min-h-[180px] sm:min-h-[460px] max-w-md flex-col justify-center gap-1 sm:gap-3.5 py-3 px-4 sm:py-10 sm:pl-20 sm:pr-10"',
    f
)

# Tag text size and padding
f = re.sub(
    r'className="inline-flex items-center gap-1\.5 w-fit rounded-full border border-\[#FFB400\]/40\s+bg-\[#FFB400\]/15 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-\[0\.2em\] text-\[#FFB400\]"',
    'className="inline-flex items-center gap-1 w-fit rounded-full border border-[#FFB400]/40 bg-[#FFB400]/15 px-2 py-0.5 sm:px-3 sm:py-1 font-sans text-[8px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#FFB400]"',
    f
)

# H1 size text-4xl -> text-xl on mobile
f = re.sub(
    r'className="font-display text-4xl leading-\[1\.05\] text-\[#F9FAFB\] sm:text-5xl transition-all duration-300"',
    'className="font-display text-xl leading-[1.05] text-[#F9FAFB] sm:text-5xl transition-all duration-300"',
    f
)

# Subtitle size text-xs -> text-[9px] on mobile
f = re.sub(
    r'className="font-sans text-xs font-semibold uppercase tracking-wide text-white/80"',
    'className="font-sans text-[9px] sm:text-xs font-semibold uppercase tracking-wide text-white/80"',
    f
)

# Description text-sm -> hidden sm:block
f = re.sub(
    r'className="font-sans text-sm leading-relaxed text-white/70"',
    'className="font-sans text-sm leading-relaxed text-white/70 hidden sm:block"',
    f
)

# Buttons spacing: mt-2 -> mt-1
f = re.sub(
    r'className="mt-2 flex flex-wrap gap-3"',
    'className="mt-1 sm:mt-2 flex flex-wrap gap-2 sm:gap-3"',
    f
)

# Primary button sizing
f = re.sub(
    r'className="rounded-xl bg-\[#FFB400\] px-6 py-3 font-sans text-sm font-semibold text-\[#0F0F0F\]\s+transition-transform duration-200 hover:scale-105 shadow-lg shadow-\[#FFB400\]/20"',
    'className="rounded-xl bg-[#FFB400] px-3 py-1.5 sm:px-6 sm:py-3 font-sans text-[10px] sm:text-sm font-semibold text-[#0F0F0F] transition-transform duration-200 hover:scale-105 shadow-md sm:shadow-lg shadow-[#FFB400]/20"',
    f
)

# Secondary button sizing
f = re.sub(
    r'className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-sans text-sm font-semibold text-white\s+transition-all hover:border-\[#FFB400\] hover:bg-\[#FFB400\]/10 hover:text-\[#FFB400\]"',
    'className="rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 sm:px-6 sm:py-3 font-sans text-[10px] sm:text-sm font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400]"',
    f
)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
