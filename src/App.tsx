import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Award,
  ChevronDown,
  MessageSquare,
  Globe,
  DollarSign,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1
} from 'lucide-react';

const VideoPlayer = ({ onFinished }: { onFinished: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted as requested
  const [showControls, setShowControls] = useState(true);
  const [showPauseMessage, setShowPauseMessage] = useState(false);
  const [showMuteMessage, setShowMuteMessage] = useState(false);

  useEffect(() => {
    const attemptPlay = async () => {
      if (!videoRef.current) return;
      
      try {
        // Try unmuted first with 50% volume
        videoRef.current.muted = false;
        videoRef.current.volume = 0.5;
        await videoRef.current.play();
        setIsPlaying(true);
        setIsMuted(false);
        setShowPauseMessage(false);
        setShowMuteMessage(false);
      } catch (error) {
        console.log("Unmuted autoplay blocked, trying muted...");
        try {
          // Try muted if unmuted fails (standard browser behavior)
          if (!videoRef.current) return;
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
          setIsMuted(true);
          setShowPauseMessage(false);
          setShowMuteMessage(true);
        } catch (mutedError) {
          console.error("Muted autoplay also blocked:", mutedError);
          setIsPlaying(false);
        }
      }
    };

    attemptPlay();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPauseMessage(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPauseMessage(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      const muted = newVolume === 0;
      setIsMuted(muted);
      if (!muted) setShowMuteMessage(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted) setShowMuteMessage(false);
    }
  };

  return (
    <div 
      className="max-w-4xl w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative group mx-auto my-2 z-50"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src="https://360conecta.com/test.mp4"
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onFinished}
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        playsInline
        autoPlay
        muted={isMuted}
      />
      
      <AnimatePresence>
        {isPlaying && isMuted && showMuteMessage && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 z-50"
          >
            <button 
              onClick={toggleMute}
              className="bg-brand text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl animate-bounce"
            >
              <VolumeX size={16} /> Activa el audio
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div className="flex flex-col gap-4">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center bg-brand text-slate-900 rounded-full hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                  </button>
                  
                  <div className="flex items-center gap-3 group/volume">
                    <button onClick={toggleMute} className="text-white hover:text-brand transition-colors">
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={isMuted ? 0 : volume} 
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-brand"
                    />
                  </div>
                </div>
                
                <div className="text-white font-mono text-xs opacity-80">
                  {videoRef.current ? (
                    <>
                      {Math.floor(videoRef.current.currentTime / 60)}:
                      {Math.floor(videoRef.current.currentTime % 60).toString().padStart(2, '0')} / 
                      {Math.floor(videoRef.current.duration / 60)}:
                      {Math.floor(videoRef.current.duration % 60).toString().padStart(2, '0')}
                    </>
                  ) : '0:00 / 0:00'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer z-50 p-6 text-center"
          onClick={togglePlay}
        >
          {showPauseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 max-w-md"
            >
              <p className="text-white text-xl md:text-2xl font-bold leading-tight">
                Por favor termina de ver el video para poder aplicar a esta carrera
              </p>
            </motion.div>
          )}
          <div className="w-20 h-20 bg-brand text-slate-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play size={40} fill="currentColor" className="ml-2" />
          </div>
        </div>
      )}
    </div>
  );
};

const Hero = ({ onVideoFinished, isVideoFinished }: { onVideoFinished: () => void, isVideoFinished: boolean }) => (
  <section className={`relative min-h-screen md:h-screen flex flex-col items-center justify-center text-center px-4 py-8 overflow-hidden transition-colors duration-700 ${isVideoFinished ? 'bg-slate-50' : 'bg-slate-900'}`}>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,179,2,0.1),transparent_50%)]" />
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl w-full relative z-50 flex flex-col items-center"
    >
      <span className="inline-block px-3 py-1 mb-2 text-[10px] md:text-xs font-bold tracking-wider text-brand uppercase bg-brand/10 rounded-full">
        Oportunidad Exclusiva
      </span>
      <h1 className={`font-display text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight transition-colors duration-700 ${isVideoFinished ? 'text-slate-900' : 'text-white'}`}>
        Esta carrera <span className="text-brand">no es para todos…</span>
      </h1>
      <p className={`text-base md:text-lg lg:text-xl mb-4 max-w-2xl mx-auto leading-relaxed transition-colors duration-700 ${isVideoFinished ? 'text-slate-600' : 'text-slate-300'}`}>
        Conviértete en Consultor de Seguros y crea una nueva línea de ingresos. 
        <span className={`block font-semibold mt-1 transition-colors duration-700 ${isVideoFinished ? 'text-slate-900' : 'text-white'}`}>Sin inversión. Con formación. Respaldado por MetLife.</span>
      </p>
      
      <div className="w-full max-w-3xl">
        <VideoPlayer onFinished={onVideoFinished} />
      </div>

      <AnimatePresence>
        {isVideoFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-4"
          >
            <a href="#form-hero" className="bg-brand text-slate-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand/20">
              Quiero aplicar <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </section>
);

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-16">
    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-slate-600 max-w-2xl">{subtitle}</p>}
  </div>
);

const WhatIsIt = () => (
  <section id="que-es" className="section-padding bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading 
            title="No es un empleo. Es una carrera basada en resultados."
            subtitle="En Conecta 360 formamos Consultores de Seguros profesionales afiliados a MetLife."
          />
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="text-brand w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-slate-900">Aquí no cumples horario</h3>
                <p className="text-slate-600">Tú decides cuándo y cómo trabajar. Eres dueño de tu tiempo.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp className="text-brand w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-slate-900">Construyes un ingreso propio</h3>
                <p className="text-slate-600">Sin techos. Tus resultados determinan directamente cuánto ganas.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                <Users className="text-brand w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-slate-900">Monetiza tu red</h3>
                <p className="text-slate-600">Aprende a ofrecer soluciones reales en protección financiera a quienes ya confían en ti.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" 
            alt="Consultores trabajando" 
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-6 -left-6 bg-brand text-slate-900 p-6 rounded-2xl shadow-xl hidden md:block">
            <p className="text-2xl font-bold">MetLife</p>
            <p className="text-sm font-semibold opacity-80">Respaldo Internacional</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhatYouWillDo = () => {
  const steps = [
    "Asesorar personas en protección financiera",
    "Detectar necesidades reales",
    "Ofrecer soluciones personalizadas",
    "Construir tu propia cartera de clientes",
    "Generar ingresos directamente de tus resultados"
  ];

  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="¿Qué implica esta carrera?" />
        <div className="grid gap-4">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10 }}
              className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="w-8 h-8 bg-brand text-slate-900 rounded-full flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </div>
              <p className="text-lg font-medium text-slate-800">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Offers = () => {
  const items = [
    { icon: <DollarSign />, title: "Sin inversión inicial", desc: "Cero pesos para iniciar" },
    { icon: <GraduationCap />, title: "Formación profesional", desc: "Capacitación completa desde cero" },
    { icon: <Award />, title: "Certificación formal", desc: "Te preparas como consultor profesional" },
    { icon: <MessageSquare />, title: "Acompañamiento", desc: "Mentoría durante el proceso" },
    { icon: <ShieldCheck />, title: "Respaldo de MetLife", desc: "Trabajas con una aseguradora sólida" },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Te damos todo para empezar" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all">
              <div className="text-brand mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    "Ingresos sin límite",
    "Horarios flexibles",
    "Trabajo remoto o híbrido",
    "Crecimiento basado en resultados",
    "Desarrollo profesional y financiero"
  ];

  return (
    <section className="section-padding bg-brand text-slate-900">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Lo que puedes construir" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/20 p-6 rounded-2xl backdrop-blur-sm">
              <CheckCircle2 className="text-slate-900 shrink-0" />
              <span className="text-lg font-bold">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FilterSection = () => {
  const noParaTi = [
    "Buscas sueldo fijo",
    "No te interesa vender",
    "No quieres trabajar con personas",
    "No estás dispuesto a aprender",
    "Prefieres estabilidad sobre crecimiento"
  ];

  const siParaTi = [
    "Quieres generar ingresos propios",
    "Tienes o puedes construir una red de contactos",
    "Te interesa el mundo financiero",
    "Buscas crecimiento real",
    "Estás dispuesto a desarrollar habilidades comerciales"
  ];

  return (
    <section className="section-padding bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Esta carrera no es para todos</h2>
          <p className="text-xl text-slate-400">Seamos honestos desde el principio.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-red-500/20">
            <div className="flex items-center gap-3 mb-8">
              <XCircle className="text-red-500 w-8 h-8" />
              <h3 className="text-2xl font-bold">No es para ti si:</h3>
            </div>
            <ul className="space-y-4">
              {noParaTi.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand/10 p-8 rounded-3xl border border-brand/20">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="text-brand w-8 h-8" />
              <h3 className="text-2xl font-bold">Pero SÍ es para ti si:</h3>
            </div>
            <ul className="space-y-4">
              {siParaTi.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const WhoWeSeek = () => {
  const profiles = [
    "Emprendedores",
    "Freelancers",
    "Coaches / entrenadores",
    "Asesores inmobiliarios",
    "Profesionales independientes",
    "Personas con networking activo"
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Perfiles que mejor funcionan en esta carrera" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profiles.map((profile, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 text-center font-bold text-slate-700 border border-slate-100">
              {profile}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Comparison = () => {
  const rows = [
    { aspect: "Ingreso", job: "Fijo", career: "Ilimitado" },
    { aspect: "Horarios", job: "Rígidos", career: "Flexibles" },
    { aspect: "Crecimiento", job: "Limitado", career: "Escalable" },
    { aspect: "Control", job: "Bajo", career: "Total" },
    { aspect: "Formación", job: "Limitada", career: "Incluida" },
  ];

  return (
    <section className="section-padding bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Empleo vs Carrera como Consultor" />
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-6 font-bold">Aspecto</th>
                <th className="p-6 font-bold">Empleo tradicional</th>
                <th className="p-6 font-bold text-brand">Conecta 360</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-semibold text-slate-500">{row.aspect}</td>
                  <td className="p-6 text-slate-700">{row.job}</td>
                  <td className="p-6 font-bold text-brand-dark">{row.career}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "¿Necesito experiencia?", a: "No. Te capacitamos desde cero." },
    { q: "¿Cuánto cuesta entrar?", a: "Nada. No hay inversión inicial." },
    { q: "¿Tengo que dejar mi trabajo?", a: "No. Puedes empezar como ingreso adicional." },
    { q: "¿Es multinivel?", a: "No. Tus ingresos dependen de tus ventas." },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="max-w-3xl mx-auto">
        <SectionHeading title="Preguntas frecuentes" />
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplicationForm = ({ enabled, id }: { enabled: boolean, id?: string }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id={id} className="section-padding bg-brand text-slate-900 text-center">
        <div className="max-w-2xl mx-auto py-20">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-slate-900" />
          <h2 className="text-4xl font-bold mb-4">¡Aplicación enviada!</h2>
          <p className="text-xl font-medium opacity-90">Nos pondremos en contacto contigo vía WhatsApp muy pronto.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="section-padding bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className={`bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 transition-all ${!enabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          <SectionHeading title="Aplica para conocer más" />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nombre completo</label>
                <input disabled={!enabled} required type="text" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed" placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">WhatsApp</label>
                <input disabled={!enabled} required type="tel" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed" placeholder="Tu número" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email</label>
                <input disabled={!enabled} required type="email" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed" placeholder="tu@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Edad</label>
                <input disabled={!enabled} required type="number" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed" placeholder="Tu edad" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Escolaridad</label>
              <select disabled={!enabled} required className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed">
                <option value="">Selecciona una opción</option>
                <option value="preparatoria">Preparatoria</option>
                <option value="licenciatura">Licenciatura</option>
                <option value="posgrado">Posgrado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">¿Tienes red de contactos?</label>
              <select disabled={!enabled} required className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all disabled:cursor-not-allowed">
                <option value="">Selecciona una opción</option>
                <option value="si">Sí, amplia</option>
                <option value="media">Media</option>
                <option value="no">No por ahora</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">¿Qué te motiva a aplicar?</label>
              <textarea disabled={!enabled} required className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-brand outline-none transition-all h-32 disabled:cursor-not-allowed" placeholder="Cuéntanos un poco sobre ti"></textarea>
            </div>
            <div className="flex items-start gap-3 bg-brand/5 p-4 rounded-xl border border-brand/10">
              <input disabled={!enabled} required type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-brand focus:ring-brand disabled:cursor-not-allowed" />
              <label className="text-sm text-slate-700 font-medium">Entiendo que es una carrera basada 100% en comisiones y resultados.</label>
            </div>
            <button disabled={!enabled} type="submit" className="w-full bg-brand text-slate-900 py-5 rounded-xl font-bold text-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed">
              {enabled ? 'Enviar aplicación' : 'Mira el video para activar'} <ArrowRight className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => (
  <section className="section-padding bg-slate-900 text-white text-center">
    <div className="max-w-3xl mx-auto">
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Si esto te hizo sentido, aplica.</h2>
      <p className="text-xl text-slate-400 mb-10 leading-relaxed">
        No es para todos. Pero si es para ti… puede cambiar tu forma de generar ingresos.
      </p>
      <a href="#form" className="inline-flex items-center gap-2 bg-brand text-slate-900 px-10 py-5 rounded-2xl font-bold text-2xl hover:bg-brand-dark transition-all group">
        Quiero participar <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 px-6 border-t border-slate-200 bg-white text-center text-slate-500 text-sm">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-brand" />
        <span className="font-bold text-slate-900">CONECTA 360</span>
      </div>
      <p>© 2026 Conecta 360. Respaldado por MetLife. Todos los derechos reservados.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-brand transition-colors">Privacidad</a>
        <a href="#" className="hover:text-brand transition-colors">Términos</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [videoFinished, setVideoFinished] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  return (
    <div className={`min-h-screen ${!videoFinished ? 'blocked-overlay' : 'video-finished'}`}>
      {/* Hero content is z-50, so it stays above the overlay */}
      <Hero 
        onVideoFinished={() => setVideoFinished(true)} 
        isVideoFinished={videoFinished}
      />

      {/* The rest of the page is below the overlay (z-40) */}
      <ApplicationForm enabled={videoFinished} id="form-hero" />
      <WhatIsIt />
      <WhatYouWillDo />
      <Offers />
      <Benefits />
      <FilterSection />
      <WhoWeSeek />
      <Comparison />
      <FAQ />
      <ApplicationForm enabled={videoFinished} id="form" />
      <FinalCTA />
      <Footer />
    </div>
  );
}
