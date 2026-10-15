import re

new_file = open('C:/Users/Ali Akintayo/Downloads/OrderDetailsPage (2).jsx').read()

# 1. Strip the dummy Header, Footer, FeaturesBar functions
new_file = re.sub(r'(?ms)/\* -+ Header -+ \*/.*?/\* -+ Account sidebar -+ \*/', '/* --------------------------------- Account sidebar -------------------------------- */', new_file)
new_file = re.sub(r'(?ms)/\* -+ Features bar -+ \*/.*', '', new_file)

# 2. Add global imports
imports = '''import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
'''
new_file = re.sub(r'(?ms)import React.*?from "lucide-react";', imports + '\nimport {\n  Search,\n  User,\n  Heart,\n  ShoppingCart,\n  Menu,\n  ChevronDown,\n  ChevronRight,\n  LayoutDashboard,\n  Package,\n  MapPin,\n  Settings,\n  LogOut,\n  Truck,\n  CheckCircle2,\n  Clock,\n  Download,\n  RotateCcw,\n  XCircle,\n  MessageCircle,\n  CreditCard,\n  Star,\n  ShieldCheck,\n  Headset,\n  Instagram,\n  Facebook,\n  Music2,\n} from "lucide-react";', new_file)

# 3. Add useTheme hook inside the main OrderDetailsPage component
new_file = new_file.replace('export default function OrderDetailsPage() {', 'export default function OrderDetailsPage() {\n  const { theme } = useTheme();\n  const isDark = theme === "dark";\n')

# 4. Remove AddressCard and PaymentCard functions from the file completely
new_file = re.sub(r'(?ms)/\* -+ Address card -+ \*/.*?/\* -+ Payment card -+ \*/', '/* --------------------------------- Payment card -------------------------------- */', new_file)
new_file = re.sub(r'(?ms)/\* -+ Payment card -+ \*/.*?/\* -+ Summary card -+ \*/', '/* --------------------------------- Summary card -------------------------------- */', new_file)

# 5. In the main component, replace AddressCard and PaymentCard with the InfoContainer
info_container_code = '''
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
                        {ORDER.shipping.name}<br />
                        {ORDER.shipping.address}<br />
                        {ORDER.shipping.phone}
                      </address>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <CreditCard size={16} className="text-[#FFB400]" />
                        <h3 className="font-sans text-sm font-semibold">Payment Method</h3>
                      </div>
                      <p className={ont-sans text-xs \}>
                        {ORDER.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
'''
new_file = re.sub(r'<AddressCard .*? />', info_container_code.replace('\\$', '$'), new_file)
new_file = re.sub(r'<PaymentCard .*? />', '', new_file)

# 6. Ensure the main component closes properly since we removed FeaturesBar and Footer functions from the file
new_file = new_file.replace('<FeaturesBar />\n        <Footer />\n      </div>\n    );\n  }', '<Footer />\n      </div>\n    );\n  }')

open('src/pages/OrderDetailsPage.jsx', 'w').write(new_file)
