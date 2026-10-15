import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# Add Zap to imports
if 'Zap,' not in f:
    f = f.replace('Sparkles,', 'Sparkles,\n    Zap,')

# Replace the broken unicode and text
f = re.sub(
    r'<span className="font-sans text-xs font-semibold uppercase tracking-\[0\.2em\] text-\[#FFB400\]">\s*.*?Limited Offer Deals\s*</span>',
    '<span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#FFB400] flex items-center gap-1.5"><Zap size={14} className="text-[#FFB400] fill-[#FFB400]" /> Limited Offer Deals</span>',
    f,
    flags=re.DOTALL
)

# Replace the CountdownBlock component
old_countdown = '''function CountdownBlock({ value, label, isDark }) {
  return (
    <div
      className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl border ${
        isDark
          ? "border-white/15 bg-[#1A1A1A] text-white"
          : "border-neutral-300 bg-white text-neutral-800 shadow-sm"
      }`}
    >
      <span className="font-display text-lg font-semibold leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className={`font-sans text-[9px] uppercase tracking-wide ${isDark ? "text-white/45" : "text-neutral-500"}`}>
        {label}
      </span>
    </div>
  );
}'''

new_countdown = '''function CountdownBlock({ value, label, isDark }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className={`font-display text-xl sm:text-2xl font-bold tabular-nums ${isDark ? "text-white" : "text-neutral-900"}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="font-sans text-[10px] font-bold text-[#FFB400]">
        {label[0].toLowerCase()}
      </span>
    </div>
  );
}'''

if old_countdown in f:
    f = f.replace(old_countdown, new_countdown)
else:
    # use regex if spaces don't perfectly match
    f = re.sub(
        r'function CountdownBlock.*?return\s*\(\s*<div.*?</div>\s*\);\s*}',
        new_countdown,
        f,
        flags=re.DOTALL
    )

# Replace the wrapper around CountdownBlock invocations
old_wrapper = r'<div className="flex items-center gap-1\.5">\s*<CountdownBlock value=\{days\} label="Days" isDark=\{isDark\} />\s*<CountdownBlock value=\{hours\} label="Hrs" isDark=\{isDark\} />\s*<CountdownBlock value=\{minutes\} label="Mins" isDark=\{isDark\} />\s*<CountdownBlock value=\{seconds\} label="Secs" isDark=\{isDark\} />\s*</div>'

new_wrapper = '''<div className={`flex items-center gap-2 sm:gap-3 rounded-full border px-4 py-2 sm:px-6 sm:py-2.5 shadow-inner ${isDark ? "border-[#FFB400]/20 bg-[#FFB400]/5" : "border-[#FFB400]/30 bg-[#FFB400]/10"}`}>
                <CountdownBlock value={days} label="Days" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={hours} label="Hrs" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={minutes} label="Mins" isDark={isDark} />
                <span className="text-[#FFB400]/40 font-bold mb-1">:</span>
                <CountdownBlock value={seconds} label="Secs" isDark={isDark} />
              </div>'''

f = re.sub(old_wrapper, new_wrapper, f, flags=re.DOTALL)

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
