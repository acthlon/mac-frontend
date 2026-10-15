import re

old_content = open('src/pages/OrderDetailsPage.jsx').read()
new_content = open('C:/Users/Ali Akintayo/Downloads/OrderDetailsPage (2).jsx').read()

# Extract the Information container from old_content
# I'll just hardcode it since it's easier and safer
info_container = '''
{/* Information Container (Combined Address & Payment) */}
<div className={ounded-xl border p-6 \}>
  <h2 className="mb-4 font-display text-2xl font-medium">Information</h2>
  
  <div className="space-y-6">
    <div>
      <div className="mb-2 flex items-center gap-2">
        <MapPin size={16} className="text-[#FFB400]" />
        <h3 className="font-sans text-sm font-semibold">Shipping Address</h3>
      </div>
      <address className={ont-sans text-xs not-italic leading-relaxed \}>
        {order.shippingAddress.name}<br />
        {order.shippingAddress.street}<br />
        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
        {order.shippingAddress.country}<br />
        {order.shippingAddress.phone}
      </address>
    </div>

    <div>
      <div className="mb-2 flex items-center gap-2">
        <CreditCard size={16} className="text-[#FFB400]" />
        <h3 className="font-sans text-sm font-semibold">Payment Method</h3>
      </div>
      <p className={ont-sans text-xs \}>
        {order.paymentMethod}
      </p>
    </div>
  </div>
</div>
'''

# We need to map ORDER from the new file to the structure expected by info_container.
# Wait, the new file uses ORDER.shipping directly.
# Let's adjust info_container to use order variable (which is ORDER in the new file, or we rename ORDER to order).
# The new file has const ORDER = {...}
# Let's just rename ORDER to order in the component, or we just pass order={ORDER} to the container.

# Wait, let's write the whole file manually by extracting the good parts of the downloaded file.
