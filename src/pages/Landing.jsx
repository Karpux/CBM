import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  ChartLine,
  ClipboardList,
  HeartHandshake,
  MapPin,
  Megaphone,
  ShieldCheck,
  Users,
  WandSparkles,
} from 'lucide-react'
import { Button } from '../components/common/Button'
import { SectionHeader } from '../components/common/SectionHeader'
import { StatCard } from '../components/common/StatCard'
import { ToolCard } from '../components/common/ToolCard'
import { WiskReveal } from '../components/common/WiskReveal'
import { TopNav } from '../components/navigation/TopNav'
import { wiskContainer, wiskFloat, wiskItem } from '../lib/wisk'
import { fetchPublicStats } from '../lib/api'

const tools = [
  {
    icon: ClipboardList,
    title: 'Registro de miembros y seguimiento',
    description: 'Ficha completa, notas pastorales y metas de discipulado con trazabilidad clara.',
    tags: ['Historial', 'Etiquetas', 'Notas privadas'],
  },
  {
    icon: CalendarCheck,
    title: 'Planificador de reuniones',
    description: 'Calendario semanal, recordatorios y logística para anfitriones y líderes.',
    tags: ['Agenda', 'Roles', 'Recordatorios'],
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento espiritual',
    description: 'Planes de cuidado, oración y visitas con indicadores de avance.',
    tags: ['Visitas', 'Oración', 'Mentorías'],
  },
  {
    icon: ChartLine,
    title: 'Panel de crecimiento',
    description: 'Métricas de asistencia, retención, nuevas conexiones y acciones de alcance.',
    tags: ['Insights', 'Tendencias', 'Alertas'],
  },
  {
    icon: Megaphone,
    title: 'Comunicación inteligente',
    description: 'Mensajes segmentados y campañas para eventos, clases y grupos pequeños.',
    tags: ['Segmentos', 'Campañas', 'Templates'],
  },
  {
    icon: ShieldCheck,
    title: 'Gobernanza y seguridad',
    description: 'Permisos por roles, aprobaciones y auditoría para mantener orden.',
    tags: ['Roles', 'Bitácora', 'Privacidad'],
  },
]

export const Landing = () => {
  const [stats, setStats] = useState({
    cells_active: 0,
    participation_rate: 0,
    new_visitors_60d: 0,
  })

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const data = await fetchPublicStats()
        if (active && data) {
          setStats({
            cells_active: data.cells_active ?? 0,
            participation_rate: data.participation_rate ?? 0,
            new_visitors_60d: data.new_visitors_60d ?? 0,
          })
        }
      } catch {
        if (active) {
          setStats({
            cells_active: 0,
            participation_rate: 0,
            new_visitors_60d: 0,
          })
        }
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="noise bg-halo">
        <TopNav />
        <main>
        <section className="container-px pb-20 pt-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div variants={wiskContainer} initial="hidden" animate="show">
              <motion.p variants={wiskItem} className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Plataforma integral para células cristianas
              </motion.p>
              <motion.h1
                variants={wiskItem}
                className="mt-5 font-display text-4xl leading-tight text-ink sm:text-5xl"
              >
                CBM Centraliza, cuida y acelera el impacto de tu célula de barrio.
              </motion.h1>
              <motion.p variants={wiskItem} className="mt-4 max-w-xl text-base text-muted">
                Un ecosistema digital para líderes, anfitriones y pastores. Organiza reuniones, acompañamiento,
                visitas y crecimiento con un flujo de trabajo claro y hermoso.
              </motion.p>
              <motion.div variants={wiskItem} className="mt-6 flex flex-wrap gap-3">
                <Button>Explorar demo</Button>
                <Button variant="outline">Ver dashboard</Button>
              </motion.div>
              <motion.div variants={wiskItem} className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted">
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand" /> Presencia barrial real
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-brand" /> Liderazgo en red
                </span>
                <span className="flex items-center gap-2">
                  <WandSparkles size={16} className="text-brand" /> Automatización sensible
                </span>
              </motion.div>
            </motion.div>

            <WiskReveal variants={wiskFloat} className="relative">
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Panel vivo</p>
                    <h3 className="mt-2 font-display text-2xl">Semana 12 · Barrio Modelo</h3>
                  </div>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
                    +8% asistencia
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-elevated p-4">
                    <p className="text-xs font-semibold uppercase text-muted">Células activas</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">{stats.cells_active}</p>
                    <p className="mt-1 text-xs text-muted">Líderes operativos</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-elevated p-4">
                    <p className="text-xs font-semibold uppercase text-muted">Participación</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">{stats.participation_rate}%</p>
                    <p className="mt-1 text-xs text-muted">Retención semanal</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-elevated p-4">
                    <p className="text-xs font-semibold uppercase text-muted">Nuevos visitantes</p>
                    <p className="mt-2 text-2xl font-semibold text-ink">+{stats.new_visitors_60d}</p>
                    <p className="mt-1 text-xs text-muted">Últimos 60 días</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl bg-hero p-4">
                  <p className="text-xs font-semibold uppercase text-muted">Alertas sensibles</p>
                  <p className="mt-2 text-sm text-ink">
                    5 familias solicitaron oración esta semana. Agenda visitas y asigna mentores en un clic.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 hidden w-48 rounded-2xl border border-border bg-surface p-4 text-xs text-muted shadow-soft lg:block">
                <p className="font-semibold text-ink">Clima espiritual</p>
                <p className="mt-2">Mayor conexión en grupos de jóvenes y parejas nuevas.</p>
              </div>
            </WiskReveal>
          </div>
        </section>

        <section className="container-px pb-16" id="vision">
          <WiskReveal variants={wiskContainer} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow="Visión pastoral"
                title="Un tablero vivo para cuidar a cada persona"
                description="CBM integra procesos de cuidado, discipulado y misión en una sola vista. Cada líder sabe qué hacer, a quién llamar y cómo avanzar con precisión." 
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Visitas activas" value="37" hint="Asignadas a 12 mentores" />
              <StatCard label="Seguimiento" value="84" hint="Rutas de acompañamiento" />
              <StatCard label="Oración" value="+62" hint="Pedidos en 14 días" />
              <StatCard label="Formación" value="6" hint="Rutas discipulares" />
            </div>
          </WiskReveal>
        </section>

        <section className="container-px pb-16" id="herramientas">
          <WiskReveal variants={wiskContainer}>
            <SectionHeader
              eyebrow="Herramientas complejas"
              title="Toda la operación en un solo lugar"
              description="Controla reuniones, gente, recursos y comunicación sin perder el calor humano. Cada módulo está conectado para evitar datos sueltos." 
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.title} {...tool} />
              ))}
            </div>
          </WiskReveal>
        </section>

        <section className="container-px pb-16" id="impacto">
          <WiskReveal variants={wiskContainer} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-surface p-8 shadow-soft">
              <h3 className="font-display text-2xl text-ink">Ruta de crecimiento CBM</h3>
              <div className="mt-6 space-y-4">
                {[
                  'Detecta necesidades reales con encuestas post-reunión.',
                  'Coordina visitas y responsables con recordatorios automáticos.',
                  'Monitorea avances y celebra testimonios con métricas claras.',
                  'Escala nuevos líderes con rutas de entrenamiento personalizadas.',
                ].map((step) => (
                  <div key={step} className="flex items-start gap-3 text-sm text-muted">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-hero p-6">
                <p className="text-xs font-semibold uppercase text-muted">Inteligencia pastoral</p>
                <p className="mt-3 text-sm text-ink">
                  Detecta células con baja asistencia y activa planes de acompañamiento sin fricción.
                </p>
                <div className="mt-4 h-2 w-full rounded-full bg-border">
                  <div className="h-2 w-3/4 rounded-full bg-brand" />
                </div>
                <p className="mt-2 text-xs text-muted">75% de metas cumplidas</p>
              </div>
              <div className="rounded-3xl border border-border bg-surface p-6">
                <p className="text-xs font-semibold uppercase text-muted">Acciones misioneras</p>
                <p className="mt-3 text-sm text-ink">Estrategia de alcance por sectores con KPIs semana a semana.</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                  <span className="rounded-full bg-brand/15 px-3 py-1 text-brand">+14 contactos</span>
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-accent">8 visitas</span>
                </div>
              </div>
            </div>
          </WiskReveal>
        </section>

        <section className="container-px pb-20" id="comunidad">
          <WiskReveal variants={wiskContainer} className="rounded-3xl bg-mesh p-10 text-ink shadow-soft">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <SectionHeader
                  eyebrow="Comunidad y cuidado"
                  title="Una experiencia que se siente humana"
                  description="Del primer saludo al discipulado avanzado. Todo el flujo prioriza relaciones profundas y sensibilidad pastoral." 
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button>Solicitar onboarding</Button>
                  <Button variant="soft">Ver hoja de ruta</Button>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface/90 p-6">
                <p className="text-xs font-semibold uppercase text-muted">Muro de oración</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-xl border border-border bg-elevated p-3">
                    Familia Rivera: petición por salud y unidad.
                  </div>
                  <div className="rounded-xl border border-border bg-elevated p-3">
                    Jovenes Unidos: apoyo para proyecto solidario del barrio.
                  </div>
                  <div className="rounded-xl border border-border bg-elevated p-3">
                    Nuevos visitantes: bienvenida y acompañamiento inicial.
                  </div>
                </div>
              </div>
            </div>
          </WiskReveal>
        </section>
        </main>
      </div>
    </div>
  )
}
