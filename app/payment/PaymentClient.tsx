"use client";
import { useState, useEffect, useRef, ReactNode } from "react";
import Image from "next/image";
import ContactSection from "../components/ContactSection";

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

const IconMada = () => (
  <Image src="/mada975b.png" alt="مدى" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />
);
const IconVisa = () => (
  <Image src="/cc975b.png" alt="بطاقات ائتمان" width={72} height={44} className="object-contain w-auto h-auto max-w-[72px] max-h-[44px]" />
);
const IconInstallment = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="8" width="36" height="32" rx="4"/>
    <path d="M16 24h16M16 30h10"/>
    <path d="M24 8v4M16 8v4M32 8v4"/>
    <circle cx="34" cy="30" r="5" fill="white" fillOpacity=".2" stroke="white"/>
    <path d="M32 30l1.5 1.5L35 28.5" strokeWidth="1.5"/>
  </svg>
);
const IconCash = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="14" width="40" height="24" rx="4"/>
    <circle cx="24" cy="26" r="6"/>
    <path d="M4 20h6M38 20h6M4 32h6M38 32h6"/>
    <path d="M24 22v8M21 24.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4l16 6v12c0 9-7 17-16 20C8 39 1 31 1 22V10l16-6z" fill="white" fillOpacity=".15"/>
    <path d="M17 24l5 5 9-10"/>
  </svg>
);
const IconCurrency = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/>
    <path d="M24 10v28M18 16h9a5 5 0 010 10h-9v-10zM18 26h10a5 5 0 010 10h-10"/>
  </svg>
);
const IconShipping = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="28" height="20" rx="2"/>
    <path d="M30 20h8l6 8v6h-14V20z"/>
    <circle cx="12" cy="36" r="4"/>
    <circle cx="36" cy="36" r="4"/>
    <path d="M2 22h28"/>
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18"/>
    <line x1="24" y1="16" x2="24" y2="16" strokeWidth="3"/>
    <line x1="24" y1="22" x2="24" y2="34"/>
  </svg>
);

const paymentMethods = [
  { title: "بطاقة مدى",        desc: "ادفع بسهولة عبر بطاقة مدى المحلية.",                        gradient: "from-[#0F4C6E] to-[#1F6F8B]",  imgBg: true,  Icon: IconMada },
  { title: "بطاقات الائتمان", desc: "نقبل فيزا وماستركارد وجميع البطاقات الائتمانية.",            gradient: "from-[#0a3550] to-[#0F4C6E]",  imgBg: true,  Icon: IconVisa },
  { title: "الأقساط",          desc: "اشتري الآن وادفع على دفعات شهرية مريحة بدون فوائد.",        gradient: "from-[#7CC043] to-[#5a9030]",  imgBg: false, Icon: IconInstallment },
];

const sections = [
  { title: "الدفع المعتمد",     gradient: "from-[#0F4C6E] to-[#1F6F8B]",  Icon: IconShield,   content: ["يتم توفير طرق دفع متعددة وآمنة تناسب احتياجات العملاء."] },
  { title: "العملة المستخدمة", gradient: "from-[#7CC043] to-[#5a9030]",  Icon: IconCurrency, content: ["العملة الرسمية المستخدمة في جميع المعاملات هي الريال السعودي (SAR)."] },
  { title: "التحويل والشحن",   gradient: "from-[#0a3550] to-[#0F4C6E]",  Icon: IconShipping, content: ["يتم تنسيق الشحن بعد تأكيد الطلب حسب بيانات العميل."] },
  { title: "ملاحظة هامة",      gradient: "from-[#1F6F8B] to-[#0a3550]",  Icon: IconInfo,     content: ["نحرص في مؤسسة البلاد الحديثة للإلكترونيات على توفير تجربة دفع واضحة وآمنة.", "بعد إتمام الطلب سيتم مراجعة البيانات والتواصل مع العميل عند الحاجة لتأكيد التفاصيل أو استكمال إجراءات الطلب."] },
];

interface Company { phone?: string; whatsapp?: string; email?: string; [k: string]: string | undefined; }

export default function PaymentClient({ company }: { company: Company }) {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);

  const anim = (delay: number) => ({
    style: {
      opacity: heroVisible ? 1 : 0,
      transform: heroVisible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    },
  });

  return (
    <main className="min-h-screen bg-[#E6F2F8] overflow-x-hidden" dir="rtl">

      {/* ══ HERO ══ */}
      <section className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(to bottom left, #0a3550, #0F4C6E, #1F6F8B)' }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 w-64 h-64 sm:w-[500px] sm:h-[500px] rounded-full bg-white/5 blur-[60px] sm:blur-[80px]" />
          <div className="absolute top-6 left-6 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-indigo-300/10 blur-2xl sm:blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 w-72 sm:w-[600px] h-24 sm:h-40 -translate-x-1/2 bg-blue-900/30 blur-2xl sm:blur-[50px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative w-full px-4 sm:px-10 lg:px-20 py-14 sm:py-24 lg:py-32 text-center text-white">
          <div {...anim(100)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-medium text-blue-100 mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CC043] animate-pulse" />
            مؤسسة البلاد الحديثة للإلكترونيات          </div>
          <h1 {...anim(220)} className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-5 leading-tight tracking-tight">
            تعرف على وسائل الدفع
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to left, #B8D8EC, #ffffff)' }}>المتاحة</span>
          </h1>
          <p {...anim(360)} className="text-[#B8D8EC]/90 text-sm sm:text-lg lg:text-xl max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-2">
            طرق دفع متعددة وآمنة تناسب احتياجات عملائنا داخل  مؤسسة البلاد الحديثة للإلكترونيات



          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 70" className="w-full h-8 sm:h-14 lg:h-16" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#E6F2F8" />
          </svg>
        </div>
      </section>

      {/* ══ PAYMENT METHODS ══ */}
      <section className="w-full px-3 sm:px-8 lg:px-20 pt-6 sm:pt-10 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-6xl mx-auto">
          {paymentMethods.map((m, i) => (
            <FadeUp key={m.title} delay={i * 90}>
              <div className="group relative bg-white rounded-2xl border border-[#B8D8EC] shadow-sm p-3 sm:p-5 lg:p-6 text-center overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center">
                <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-l ${m.gradient}`} />
                <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform duration-300 ${
                  m.imgBg ? "bg-white border border-gray-100 p-2 sm:p-3" : `bg-linear-to-br ${m.gradient} text-white`
                }`}>
                  <m.Icon />
                </div>
                <p className="text-xs sm:text-sm lg:text-base font-extrabold text-gray-800 mb-1 leading-snug">{m.title}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══ INFO SECTIONS ══ */}
      <section className="w-full px-3 sm:px-8 lg:px-20 py-6 sm:py-10 max-w-6xl mx-auto space-y-3 sm:space-y-5">
        {sections.map((s, i) => (
          <FadeUp key={s.title} delay={i * 100}>
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className={`sm:w-2 w-full h-1.5 sm:h-auto bg-linear-to-b ${s.gradient} shrink-0`} />
                <div className="flex-1 p-4 sm:p-7 lg:p-9">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br ${s.gradient} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <s.Icon />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-gray-800">{s.title}</h2>
                      <div className={`h-0.5 w-8 sm:w-10 mt-1 sm:mt-1.5 rounded-full bg-linear-to-l ${s.gradient}`} />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    {s.content.map((p, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed sm:leading-loose text-xs sm:text-sm lg:text-base">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}

        <ContactSection
          title="التواصل بخصوص الدفع"
          phone={company.phone}
          whatsapp={company.whatsapp}
          email={company.email}
          fadeDelay={300}
        />
      </section>

      <div className="h-10 sm:h-16" />
    </main>
  );
}
