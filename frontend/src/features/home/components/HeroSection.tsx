import { ArrowRight, ShoppingCart, Truck, Users, Handshake, Bot, BadgeCheck, Calculator } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import farmersImg from '@/assets/kerala_farmers_foreground.png'

/* ─── Floating glass chip ─────────────────────────────────────────────────── */
interface ChipProps {
    icon: React.ElementType
    label: string
    className?: string
}
function FloatingChip({ icon: Icon, label, className = '' }: ChipProps) {
    return (
        <div
            className={`absolute flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-lg backdrop-blur-md ${className}`}
        >
            <Icon size={13} className="text-green-600 shrink-0" />
            {label}
        </div>
    )
}

/* ─── Story card ──────────────────────────────────────────────────────────── */
interface StoryCardProps {
    Icon: React.ElementType
    iconColor: string
    iconBg: string
    title: string
    desc: string
}
function StoryCard({ Icon, iconColor, iconBg, title, desc }: StoryCardProps) {
    return (
        <div className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <span
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: iconBg }}
            >
                <Icon size={20} style={{ color: iconColor }} />
            </span>
            <div>
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
        </div>
    )
}

/* ─── Hero Section ────────────────────────────────────────────────────────── */
export function HeroSection() {
    return (
        <>
            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <section
                className="relative w-full overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #f0fdf4 100%)',
                    minHeight: '90vh',
                }}
            >
                {/* Subtle radial glow behind farmer visual */}
                <div
                    className="pointer-events-none absolute right-0 top-0 h-full w-1/2"
                    style={{
                        background: 'radial-gradient(ellipse 70% 80% at 70% 50%, rgba(134,239,172,0.30) 0%, transparent 70%)',
                    }}
                />

                {/* Very faint leaf texture overlay */}
                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern id="leafpat" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="12" fill="#15803d" />
                            <path d="M30 18 Q42 24 30 42 Q18 24 30 18Z" fill="#15803d" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#leafpat)" />
                </svg>

                {/* ─── Two-column grid ──────────────────────────────────── */}
                <div className="relative z-10 mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:py-24">

                    {/* ── LEFT: Product messaging ─────────────────────── */}
                    <div className="flex flex-col gap-7 lg:pr-8">

                        {/* Badge */}
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold tracking-wide text-green-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                            Agentic AI Marketplace
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.5rem]">
                            Empowering Farmers with{' '}
                            <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: 'linear-gradient(90deg, #16a34a, #22c55e)' }}
                            >
                                Fair Prices
                            </span>{' '}
                            Driven by AI Agents.
                        </h1>

                        {/* Subheadline */}
                        <p className="max-w-lg text-base leading-relaxed text-gray-500 sm:text-lg">
                            FairCrop AI connects farmers and buyers across Kerala and uses intelligent
                            agents to negotiate profitable crop deals — evaluating price, distance, and
                            delivery cost.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            {/* Primary — navigate to farmer dashboard */}
                            <Link
                                to="/dashboard"
                                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] no-underline"
                                style={{
                                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                    boxShadow: '0 6px 24px rgba(34,197,94,0.40)',
                                }}
                            >
                                Start as Farmer
                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            {/* Secondary */}
                            <button className="inline-flex items-center gap-2.5 rounded-full border-2 border-green-200 bg-white px-7 py-3.5 text-sm font-semibold text-green-700 transition-all duration-300 hover:border-green-400 hover:bg-green-50 hover:-translate-y-0.5 active:scale-[0.98]">
                                <ShoppingCart size={15} />
                                Explore Marketplace
                            </button>
                        </div>

                        {/* Social proof strip */}
                        <div className="flex flex-wrap items-center gap-5 pt-2">
                            {[
                                { value: '3,200+', label: 'Farmers' },
                                { value: '18%', label: 'More profit' },
                                { value: '92%', label: 'Satisfaction' },
                            ].map((s) => (
                                <div key={s.label} className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-extrabold text-gray-900">{s.value}</span>
                                    <span className="text-xs font-medium text-gray-400">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Farmers visual composition ────────────── */}
                    <div className="relative flex items-end justify-center lg:justify-end">

                        {/* Soft radial ground glow */}
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-3/4 rounded-full blur-2xl"
                            style={{ background: 'radial-gradient(ellipse, rgba(134,239,172,0.45) 0%, transparent 70%)' }}
                        />

                        {/* Farmers image */}
                        <img
                            src={farmersImg}
                            alt="Happy Kerala farmer using FairCrop AI"
                            className="relative z-10 w-full max-w-sm select-none lg:max-w-md"
                            draggable={false}
                            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }}
                        />

                        {/* Floating chips — pinned around the farmer image */}
                        <FloatingChip
                            icon={Bot}
                            label="AI Negotiation"
                            className="left-0 top-[15%] lg:-left-4 animate-[float_4s_ease-in-out_infinite]"
                        />
                        <FloatingChip
                            icon={BadgeCheck}
                            label="Best Buyer Selected"
                            className="right-2 top-[8%] lg:-right-2 animate-[float_4s_ease-in-out_0.8s_infinite]"
                        />
                        <FloatingChip
                            icon={Calculator}
                            label="Logistics Cost Calculated"
                            className="left-2 bottom-[28%] lg:-left-6 animate-[float_4s_ease-in-out_1.6s_infinite]"
                        />
                        <FloatingChip
                            icon={BadgeCheck}
                            label="Transparent Profit"
                            className="right-0 bottom-[18%] lg:-right-4 animate-[float_4s_ease-in-out_2.4s_infinite]"
                        />
                    </div>
                </div>

                {/* Bottom fade into next section */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
            </section>

            {/* Keyframe for floating animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
            `}</style>

            {/* ══ PROBLEM → SOLUTION STRIP ══════════════════════════════════ */}
            <section className="relative z-10 mx-auto -mt-4 max-w-7xl px-6 pb-20">
                <p className="mb-8 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    The Problem We're Solving
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <StoryCard
                        Icon={Users}
                        iconColor="#ef4444"
                        iconBg="#fee2e2"
                        title="Farmers Lose to Middlemen"
                        desc="Small-scale farmers are forced to accept below-market prices from local middlemen with no alternatives or bargaining power."
                    />
                    <StoryCard
                        Icon={Truck}
                        iconColor="#f59e0b"
                        iconBg="#fef3c7"
                        title="Buyers Face Logistics Uncertainty"
                        desc="Buyers struggle to assess the true cost of procurement — distance, transport, and freshness are never factored in transparently."
                    />
                    <StoryCard
                        Icon={Handshake}
                        iconColor="#16a34a"
                        iconBg="#f0fdf4"
                        title="FairCrop AI Bridges the Gap"
                        desc="Our AI agents negotiate in real-time, balancing farmer expectations and buyer budgets with full logistics awareness."
                    />
                </div>
            </section>
        </>
    )
}
