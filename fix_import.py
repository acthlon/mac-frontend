import re

f = open('src/pages/HomePage.jsx').read()

# First, fix the broken import. 
# Match import { ... } from "lucide-react"; or the broken } Star, } from "lucide-react";
f = re.sub(r'(?ms)import\s+\{.*?} from "lucide-react";', 'import { X, ChevronRight, Star, Quote, ChevronLeft, Minus, Plus, Play, Pause, ArrowRight, TrendingUp, Sparkles, Instagram as InstagramIcon, Facebook as FacebookIcon } from "lucide-react";', f)

open('src/pages/HomePage.jsx', 'w').write(f)
