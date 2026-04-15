"use client";
import { useEffect, useRef, useState } from "react";
import ContactSection from "../components/ContactSection";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
      transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ── Icons ── */
const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBan = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeLinecap="round"/>
  </svg>
);
const IconXCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15" strokeLinecap="round"/>
    <line x1="9" y1="9" x2="15" y2="15" strokeLinecap="round"/>
  </svg>
);

const sections = [
  {
    Icon: IconBox,
    title: "حالة المنتج",
    gradient: "from-[#0F4C6E] to-[#1F6F8B]",
    bg: "bg-[#E6F2F8]",
    iconText: "text-[#0F4C6E]",
    content: [
      "يشترط أن يكون المنتج في حالته الأصلية وغير مستخدم، مع الحفاظ على التغليف والملحقات والفاتورة إن وجدت.",
    ],
  },
  {
    Icon: IconClock,
    title: "مدة طلب الاسترجاع",
    gradient: "from-[#0a3550] to-[#0F4C6E]",
    bg: "bg-[#ddeef7]",
    iconText: "text-[#0a3550]",
    content: [
      "يتم تقديم طلبات الاستبدال أو الاسترجاع خلال المدة المحددة حسب سياسة المتجر، وبعد مراجعة حالة الطلب والمنتج.",
    ],
  },
  {
    Icon: IconBan,
    title: "المنتجات غير القابلة للاسترجاع",
    gradient: "from-[#1F6F8B] to-[#0a3550]",
    bg: "bg-[#ddeef7]",
    iconText: "text-[#1F6F8B]",
    content: [
      "بعض المنتجات قد لا تكون قابلة للاسترجاع أو الاستبدال بعد فتحها أو استخدامها، وخاصة المنتجات الشخصية أو الرقمية أو التي تم تجهيزها بطلب خاص.",
    ],
  },
  {
    Icon: IconXCircle,
    title: "إلغاء الطلبات",
    gradient: "from-[#7CC043] to-[#5a9030]",
    bg: "bg-[#eaf5d8]",
    iconText: "text-[#5a9030]",
    content: [
      "يمكن إلغاء الطلب قبل التجهيز أو الشحن، أما إذا تم شحن الطلب فيتم التعامل معه وفق سياسة الاسترجاع المعتمدة.",
    ],
  },
];

type Company = { whatsapp?: string; email?: string; phone?: string };

export default function ReturnPolicyClient() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 60); return () => clearTimeout(t); }, []);
  useEffect(() => {
    fetch("/api/admin/company").then((r) => r.json()).then(setCompany).catch(() => {});
  }, []);

  const anim = (delay: number) => ({
    style: {
      opacity: heroVisible ? 1 : 0,
      transform: heroVisible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    },
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <main className="min-h-screen bg-[#E6F2F8] overflow-x-hidden" dir="rtl">

      {/* ════════ HERO ════════ */}
      <section className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(to bottom left, #0a3550, #0F4C6E, #1F6F8B)' }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-[80px]" />
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-300/10 blur-[60px]" />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-40 -translate-x-1/2 bg-blue-900/30 blur-[50px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative w-full px-5 sm:px-12 lg:px-20 py-20 sm:py-32 text-center text-white">
          <div {...anim(100)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7CC043] animate-pulse" />
            الشروط والسياسات
          </div>
          <h1 {...anim(220)} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 leading-tight tracking-tight">
            سياسة الاستبدال
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to left, #B8D8EC, #ffffff)' }}>
              والاسترجاع
            </span>
          </h1>
          <p {...anim(360)} className="text-[#B8D8EC]/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            الشروط المنظمة لطلبات الإلغاء والاستبدال والاسترجاع داخل مؤسسة تبارك التقنية الذكية
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 70" className="w-full h-12 sm:h-16" preserveAspectRatio="none">
            <path d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z" fill="#E6F2F8" />
          </svg>
        </div>
      </section>

      {/* ════════ SECTIONS ════════ */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10 space-y-4 sm:space-y-5">
        {sections.map((s, i) => (
          <FadeUp key={s.title} delay={i * 100}>
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-[#B8D8EC] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className={`w-full h-1.5 sm:w-1.5 sm:h-auto bg-linear-to-r sm:bg-linear-to-b ${s.gradient} shrink-0`} />
                <div className="flex-1 p-4 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${s.bg} ${s.iconText} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <s.Icon />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-gray-800">{s.title}</h2>
                      <div className={`h-0.5 w-8 mt-1 rounded-full bg-linear-to-l ${s.gradient}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {s.content.map((p, j) => (
                      <p key={j} className="text-gray-600 leading-relaxed text-sm sm:text-base">{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        ))}

        <ContactSection
          title="التواصل بخصوص الطلبات"
          phone={company?.phone}
          whatsapp={company?.whatsapp}
          email={company?.email}
          fadeDelay={400}
        />
      </section>

      <div className="h-16" />
    </main>
  );
}
