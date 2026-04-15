"use client";
import { useEffect, useRef, useState } from "react";
import ContactSection from "../components/ContactSection";

/* ── Intersection Observer hook ── */
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
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="8.01" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round"/>
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth={1.8}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
  </svg>
);

/* ── Data ── */
const sections = [
  {
    Icon: IconDoc,
    title: "استخدام الموقع",
    gradient: "from-[#0F4C6E] to-[#1F6F8B]",
    bg: "bg-[#E6F2F8]",
    iconText: "text-[#0F4C6E]",
    content: [
      "باستخدامك لهذا الموقع فإنك توافق على الالتزام بالشروط والأحكام والسياسات المعمول بها داخل مؤسسة تبارك التقنية الذكية.",
    ],
  },
  {
    Icon: IconShield,
    title: "الخصوصية وحماية البيانات",
    gradient: "from-[#0a3550] to-[#0F4C6E]",
    bg: "bg-[#ddeef7]",
    iconText: "text-[#0a3550]",
    content: [
      "نلتزم بالحفاظ على خصوصية بيانات العملاء وعدم استخدامها إلا في حدود معالجة الطلبات وتحسين الخدمة والتواصل عند الحاجة.",
    ],
  },
  {
    Icon: IconInfo,
    title: "دقة المعلومات",
    gradient: "from-[#7CC043] to-[#5a9030]",
    bg: "bg-[#eaf5d8]",
    iconText: "text-[#5a9030]",
    content: [
      "نحرص على عرض المعلومات والمنتجات والأسعار بأكبر قدر ممكن من الدقة، ومع ذلك قد تحدث تحديثات أو تعديلات دون إشعار مسبق.",
    ],
  },
  {
    Icon: IconChat,
    title: "الطلبات والتواصل",
    gradient: "from-[#1F6F8B] to-[#0a3550]",
    bg: "bg-[#ddeef7]",
    iconText: "text-[#1F6F8B]",
    content: [
      "يحق للمتجر مراجعة أو تأكيد الطلبات والتواصل مع العميل عند الحاجة لإتمام البيانات أو تأكيد تفاصيل الشحن والدفع.",
    ],
  },
];

const storeInfoGradient = "from-[#0F4C6E] to-[#0a3550]";

type Company = { nameAr?: string; addressAr?: string; phone?: string; whatsapp?: string; email?: string; taxNumber?: string };

export default function PrivacyPage() {
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
            سياسة الخصوصية
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to left, #B8D8EC, #ffffff)' }}>
              واتفاقية الاستخدام
            </span>
          </h1>
          <p {...anim(360)} className="text-[#B8D8EC]/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            الشروط العامة المنظمة لاستخدام موقع مؤسسة تبارك التقنية الذكية
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

        {/* ════════ STORE INFO ════════ */}
        {company && (
          <FadeUp delay={sections.length * 100}>
            <div className="group bg-white rounded-2xl sm:rounded-3xl border border-[#B8D8EC] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row">
                <div className={`w-full h-1.5 sm:w-1.5 sm:h-auto bg-linear-to-r sm:bg-linear-to-b ${storeInfoGradient} shrink-0`} />
                <div className="flex-1 p-4 sm:p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E6F2F8] text-[#0F4C6E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <IconLock />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-extrabold text-gray-800">معلومات المتجر</h2>
                      <div className={`h-0.5 w-8 mt-1 rounded-full bg-linear-to-l ${storeInfoGradient}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {company.nameAr    && <p className="text-gray-600 text-sm sm:text-base"><span className="font-semibold text-gray-700">اسم الجهة:</span> {company.nameAr}</p>}
                    {company.addressAr && <p className="text-gray-600 text-sm sm:text-base"><span className="font-semibold text-gray-700">العنوان:</span> {company.addressAr}</p>}
                    {company.phone     && <p className="text-gray-600 text-sm sm:text-base"><span className="font-semibold text-gray-700">الهاتف:</span> {company.phone}</p>}
                    {company.email     && <p className="text-gray-600 text-sm sm:text-base break-all"><span className="font-semibold text-gray-700">البريد الإلكتروني:</span> {company.email}</p>}
                    {company.taxNumber && <p className="text-gray-600 text-sm sm:text-base"><span className="font-semibold text-gray-700">الرقم الضريبي:</span> {company.taxNumber}</p>}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        <ContactSection
          title="وسائل التواصل"
          phone={company?.whatsapp}
          whatsapp={company?.whatsapp}
          email={company?.email}
          fadeDelay={300}
        />
      </section>

      <div className="h-16" />
    </main>
  );
}
