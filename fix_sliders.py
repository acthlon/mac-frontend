import re

f = open('src/pages/HomePage.jsx', encoding='utf-8').read()

# --- FlashSale ---
flash_sale_pattern = r'(function FlashSale\(\{.*?\}\) \{)(.*?)(return \(\s*<section.*?<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">)(.*?)(</div>\s*</div>\s*</section>\s*\);\s*})'
match = re.search(flash_sale_pattern, f, re.DOTALL)
if match:
    func_def = match.group(1)
    body = match.group(2)
    return_pre = match.group(3)
    grid_content = match.group(4)
    return_post = match.group(5)
    
    # Add scrollRef and handleScroll to body
    new_body = body + '''  const scrollRef = React.useRef(null);
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
'''
    
    # Replace grid with flex slider container
    new_return_pre = return_pre.replace('<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">', '<div className="relative group/slider mt-6 flex items-center min-w-0">')
    
    # Wrap grid content with slider buttons and scroll container
    new_grid_content = '''
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="absolute -left-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full snap-x snap-mandatory"
            >
              {flashProducts.map((p) => (
                <div key={p.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                  <ProductCard product={p} isDark={isDark} />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="absolute -right-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
'''
    f = f[:match.start()] + func_def + new_body + new_return_pre + new_grid_content + return_post + f[match.end():]

# --- NewArrivals ---
new_arrivals_pattern = r'(function NewArrivals\(\{.*?\}\) \{)(.*?)(return \(\s*<section.*?)(\s*<div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">\s*\{newProducts\.map\(\(p\) => \(\s*<ProductCard.*?\/>\s*\)\)\}\s*<\/div>)(\s*<\/section>\s*\);\s*})'
match = re.search(new_arrivals_pattern, f, re.DOTALL)
if match:
    func_def = match.group(1)
    body = match.group(2)
    return_pre = match.group(3)
    grid_content = match.group(4)
    return_post = match.group(5)
    
    # Add scrollRef and handleScroll
    new_body = body + '''  const scrollRef = React.useRef(null);
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
'''
    
    new_grid_content = '''
        <div className="relative group/slider mt-5 flex items-center min-w-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous products"
              className="absolute -left-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth py-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full snap-x snap-mandatory"
            >
              {newProducts.map((p) => (
                <div key={p.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                  <ProductCard product={p} isDark={isDark} badge="New" />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next products"
              className="absolute -right-3 top-[40%] z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#0F0F0F]/80 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-[#FFB400] hover:text-[#0F0F0F] shadow-lg"
            >
              <ChevronRight size={16} />
            </button>
        </div>'''
    f = f[:match.start()] + func_def + new_body + return_pre + new_grid_content + return_post + f[match.end():]

open('src/pages/HomePage.jsx', 'w', encoding='utf-8').write(f)
