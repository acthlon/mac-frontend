import re

f = open('src/pages/OrderDetailsPage.jsx').read()

# 1. Update SummaryCard
summary_old = '''      <div className="mt-4 space-y-3 font-sans text-sm">
        <div className="flex items-center justify-between text-white/70">
          <span>Subtotal</span>
          <span className="text-white/90">{formatNaira(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>Shipping Fee</span>
          <span className="text-white/90">{order.shippingFee === 0 ? "Free" : formatNaira(order.shippingFee)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex items-center justify-between text-white/70">
            <span>Discount</span>
            <span className="text-[#FFB400]">-{formatNaira(order.discount)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-sans text-sm font-semibold text-white">Total</span>
        <span className="font-display text-2xl text-[#F9FAFB]">{formatNaira(order.total)}</span>
      </div>'''

summary_new = '''      <div className="mt-4 space-y-3 font-sans text-sm">
        <div className="flex items-center justify-between text-white/70">
          <span>Items Total</span>
          <span className="text-white/90">{formatNaira(order.subtotal + order.discount)}</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>Total Discount</span>
          <span className="text-[#FFB400]">{order.discount > 0 ? "-" : ""}{formatNaira(order.discount)}</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>Subtotal</span>
          <span className="text-white/90">{formatNaira(order.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-white/70">
          <span>Shipping Fee</span>
          <span className="text-white/90">{order.shippingFee === 0 ? "Free" : formatNaira(order.shippingFee)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-sans text-sm font-semibold text-white">Order Total</span>
        <span className="font-display text-2xl text-[#F9FAFB]">{formatNaira(order.total)}</span>
      </div>'''

f = f.replace(summary_old, summary_new)

# 2. Update ItemRow action buttons
item_buttons_old = '''          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-sans text-xs text-white/70 transition-colors duration-200 hover:border-red-400/50 hover:text-red-400"
            >
              <RotateCcw size={12} /> Return / Refund
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-sans text-xs text-white/70 transition-colors duration-200 hover:border-[#FFB400] hover:text-[#FFB400]"
            >
              <Star size={12} /> {item.reviewed ? "View Review" : "Leave a Review"}
            </button>
          </div>'''

item_buttons_new = '''          <div className="mt-3 flex flex-wrap gap-4">
            <button
              type="button"
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-white/70 transition-colors duration-200 hover:text-[#FFB400]"
            >
              <Truck size={12} /> Track Order
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-white/70 transition-colors duration-200 hover:text-red-400"
            >
              <RotateCcw size={12} /> Return / Refund
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-white/70 transition-colors duration-200 hover:text-[#FFB400]"
            >
              <Star size={12} /> {item.reviewed ? "View Review" : "Leave a Review"}
            </button>
          </div>'''

f = f.replace(item_buttons_old, item_buttons_new)

# 3. Add Truck to the imports if missing
if 'Truck' not in f:
    f = f.replace('RotateCcw, XCircle, MessageCircle, CreditCard, Star,', 'RotateCcw, XCircle, MessageCircle, CreditCard, Star, Truck,')

open('src/pages/OrderDetailsPage.jsx', 'w').write(f)
