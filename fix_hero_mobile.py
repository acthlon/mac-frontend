import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# Replace image classes
f = f.replace('className="h-[420px] w-full object-cover sm:h-[460px]"', 'className="h-[240px] w-full object-cover sm:h-[460px]"')

# Replace content wrapper classes
f = f.replace('className="relative z-10 flex min-h-[420px] sm:min-h-[460px] max-w-md flex-col justify-center gap-3.5 \\npy-6 pl-16 pr-6 sm:py-10 sm:pl-20 sm:pr-10"', 'className="relative z-10 flex min-h-[240px] sm:min-h-[460px] max-w-md flex-col justify-center gap-2 sm:gap-3.5 py-4 pl-6 pr-4 sm:py-10 sm:pl-20 sm:pr-10"')
f = f.replace('className="relative z-10 flex min-h-[420px] sm:min-h-[460px] max-w-md flex-col justify-center gap-3.5 \npy-6 pl-16 pr-6 sm:py-10 sm:pl-20 sm:pr-10"', 'className="relative z-10 flex min-h-[240px] sm:min-h-[460px] max-w-md flex-col justify-center gap-2 sm:gap-3.5 py-4 pl-6 pr-4 sm:py-10 sm:pl-20 sm:pr-10"')

# If it's on one line
f = f.replace('className="relative z-10 flex min-h-[420px] sm:min-h-[460px] max-w-md flex-col justify-center gap-3.5 py-6 pl-16 pr-6 sm:py-10 sm:pl-20 sm:pr-10"', 'className="relative z-10 flex min-h-[240px] sm:min-h-[460px] max-w-md flex-col justify-center gap-2 sm:gap-3.5 py-4 px-5 sm:py-10 sm:pl-20 sm:pr-10"')


# Adjust text sizes
f = f.replace('className="font-display text-4xl sm:text-5xl font-semibold text-white"', 'className="font-display text-2xl sm:text-5xl font-semibold text-white"')
f = f.replace('className="font-sans text-xs sm:text-sm leading-relaxed text-white/70"', 'className="font-sans text-[10px] sm:text-sm leading-relaxed text-white/70 hidden sm:block"')

# Adjust button sizes
f = f.replace('className="rounded-xl bg-[#FFB400] px-5 py-2.5 font-sans text-xs font-bold text-[#0F0F0F] transition-all hover:scale-105 hover:bg-white sm:px-6 sm:py-3"', 'className="rounded-xl bg-[#FFB400] px-4 py-2 sm:px-6 sm:py-3 font-sans text-[10px] sm:text-xs font-bold text-[#0F0F0F] transition-all hover:scale-105 hover:bg-white"')
f = f.replace('className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-sans text-xs font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400] sm:px-6 sm:py-3"', 'className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 sm:px-6 sm:py-3 font-sans text-[10px] sm:text-xs font-semibold text-white transition-all hover:border-[#FFB400] hover:bg-[#FFB400]/10 hover:text-[#FFB400]"')

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
