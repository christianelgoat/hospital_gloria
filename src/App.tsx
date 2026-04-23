import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowDown, AlertCircle, Hourglass, ZoomIn, X } from 'lucide-react';

const ROW_HEIGHTS = {
  header: 'h-24',
  evidencia: 'h-40',
  cliente: 'h-36',
  separator: 'h-12',
  frontstage: 'h-36',
  backstage: 'h-36',
  soporte: 'h-32'
};

const colors = {
  cliente: "bg-blue-100 border-blue-400 text-blue-900 border-2",
  frontstage: "bg-orange-100 border-orange-400 text-orange-900 border-2",
  backstage: "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-900 border-2",
  soporte: "bg-slate-50 border-slate-300 text-slate-700 border-2",
};

const stages = [
  {
    id: "A",
    title: "Etapa A: Llegada y Triaje",
    evidencia: { items: ["Ticket de turno", "Área de triaje"] },
    cliente: { actor: "Paciente", action: "Entra a Emergencias (CE), toma un número", arrowRight: true, arrowDown: true },
    frontstage: { actor: "Enfermera de triaje", action: "Evalúa y categoriza al paciente (P1 a P3)", arrowDown: true },
    backstage: null,
    soporte: { actor: "Sistema", action: "Sistema de Clasificación Triage" }
  },
  {
    id: "B",
    title: "Etapa B: Registro y Pago",
    evidencia: { items: ["Mostrador de registro", "Formularios administrativos"] },
    cliente: { actor: "Paciente", action: "Completa información administrativa y realiza el pago inicial", arrowRight: true, arrowDown: true },
    frontstage: { actor: "Oficinista de registro", action: "Procesa documentos y cobro", arrowDown: true },
    backstage: null,
    soporte: { actor: "Base de datos", action: "Sistema de facturación y pacientes" }
  },
  {
    id: "C",
    title: "Etapa C: Espera",
    zoomable: true,
    evidencia: { 
      items: ["Sala de espera pequeña", "TV con dibujos animados", "TV con números de turno", "Pantalla 'Tiempo Estimado'"],
      failPoints: ["Pantalla de Tiempo Estimado: Sobreestima el tiempo, generando ansiedad"]
    },
    cliente: { actor: "Paciente", action: "Espera en la sala (entorno estresante por falta de espacio)" }, 
    frontstage: null,
    backstage: { actor: "Personal Administrativo", action: "Actualiza manualmente la pizarra de horarios de médicos cada mañana", arrowDown: true },
    soporte: { actor: "Algoritmo", action: "Calcula el tiempo de espera (inexacto en horas pico)" }
  },
  {
    isDelay: true,
  },
  {
    id: "D",
    title: "Etapa D: Consulta Médica",
    evidencia: { items: ["Consultorios (del 1 al 22)", "Señalética", "Beepers / TV"] },
    cliente: { actor: "Paciente", action: "Entra al consultorio cuando el número parpadea o llaman su nombre", arrowRight: true, arrowDown: true },
    frontstage: { 
      actor: "Médico", 
      action: "Realiza la consulta médica (Residente, etc.)",
      failPoints: [
        "Inconsistencia de llamado: Unos usan TV/Beepers, otros usan Sistema de Voceo (PA system) porque es más efectivo",
        "Retraso por no-shows: Doctores esperan hasta 10 mins a pacientes ausentes, deteniendo todo el flujo"
      ],
      arrowDown: true
    },
    backstage: { actor: "Senior Doctors", action: "Standby para asesorar a residentes ante obstáculos", arrowDown: true },
    soporte: { actor: "Sistemas", action: "Llamado (Beepers/TV) y Voceo (PA System - principal)" }
  },
  {
    id: "E",
    title: "Etapa E: Farmacia y Salida",
    evidencia: { 
      items: ["Farmacia", "Pasillo hacia el lobby", "Máquinas expendedoras de snacks/bebidas"],
      failPoints: ["Pasillo con máquinas exp.: punto de congestión física de alto tráfico (distractor)"]
    },
    cliente: { actor: "Paciente", action: "Va a la farmacia, recoge medicinas y hace el pago final", arrowDown: true },
    frontstage: { actor: "Farmacéutico/Cajero", action: "Entrega medicamentos y procesa pago final", arrowDown: true },
    backstage: null,
    soporte: { actor: "Sistemas", action: "Inventario de farmacia y cierre de cuenta hospitalaria" }
  }
];

const EvidenciaBlock = ({ items, failPoints }: any) => (
  <div className="w-full h-full rounded-lg border-2 border-dashed border-slate-300 bg-white p-3 flex flex-col justify-center items-center relative shadow-sm hover:border-slate-400 transition-colors">
    <ul className="text-[12px] space-y-1 text-slate-600 list-disc list-inside text-left w-full pl-2">
      {items.map((item: string, i: number) => (
         <li key={i}>{item}</li>
      ))}
    </ul>
    {failPoints && failPoints.map((fp: string) => (
       <div key={fp} className="absolute -top-3 -right-3 group cursor-pointer z-50">
          <AlertCircle className="text-red-500 bg-white rounded-full shadow-sm" size={24} />
          <div className="absolute hidden group-hover:block bg-red-900 text-white min-w-48 text-xs p-2 rounded shadow-lg -mt-2 ml-6 text-left">
             <span className="font-bold text-red-300">Punto de Falla:</span> {fp}
          </div>
       </div>
    ))}
  </div>
);

const Block = ({ data, type }: { data: any, type: keyof typeof colors }) => {
  if (!data) return <div className="w-full h-full"></div>;
  const { actor, action, failPoints, arrowRight, arrowDown } = data;
  return (
    <div className={`w-full h-full rounded-lg shadow-sm relative flex flex-col items-center justify-center text-center p-3 leading-snug hover:shadow-md transition-shadow ${colors[type]}`}>
      {actor && <span className="font-bold text-[13px] block mb-1">[{actor}]</span>}
      {action && <span className="text-[12px]">{action}</span>}
      
      {failPoints && failPoints.map((fp: string) => (
         <div key={fp} className="absolute -top-3 -right-3 group cursor-pointer z-50">
            <AlertCircle className="text-red-500 bg-white rounded-full shadow-sm" size={24} />
            <div className="absolute hidden group-hover:block bg-gray-900 text-white min-w-48 text-xs p-2 rounded -mt-2 ml-6 text-left">
               <span className="font-bold text-red-400">Punto de Falla:</span> {fp}
            </div>
         </div>
      ))}
  
      {arrowRight && (
         <div className="absolute top-1/2 -right-[26px] -translate-y-1/2 z-10 text-gray-400">
            <ArrowRight size={20} />
         </div>
      )}
  
      {arrowDown && (
         <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 text-gray-400">
            <ArrowDown size={20} />
         </div>
      )}
    </div>
  );
};

const DelayCol = () => (
  <div className="flex flex-col w-20 flex-shrink-0 items-center justify-start">
     <div className={`${ROW_HEIGHTS.header}`}></div>
     <div className={`${ROW_HEIGHTS.evidencia}`}></div>
     <div className={`${ROW_HEIGHTS.cliente} flex relative items-center justify-center w-full`}>
         <div className="absolute w-full border-t-[3px] border-dotted border-blue-400 z-0 top-1/2 -translate-y-1/2"></div>
         <Hourglass className="text-orange-500 bg-gray-50 p-1 relative z-10" size={32} />
         <div className="absolute top-2/3 text-[10px] font-bold text-orange-600 bg-orange-100 px-1 rounded whitespace-nowrap mt-4">Domingos críticos</div>
     </div>
     <div className={`${ROW_HEIGHTS.separator} flex items-center w-full`}><div className="w-full border-t-2 border-dashed border-gray-400"></div></div>
     <div className={`${ROW_HEIGHTS.frontstage}`}></div>
     <div className={`${ROW_HEIGHTS.separator} flex items-center w-full`}><div className="w-full border-t-2 border-dashed border-gray-400"></div></div>
     <div className={`${ROW_HEIGHTS.backstage}`}></div>
     <div className={`${ROW_HEIGHTS.soporte}`}></div>
  </div>
);

export default function App() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-800">
      <div className="flex flex-col flex-1 pb-10">
        
        <div className="flex-1 overflow-auto p-8 select-none">
           <div className="flex min-w-max gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
              
              <div className="w-64 flex flex-col flex-shrink-0 z-20 bg-gray-50 rounded-l-xl border-r-2 border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                <div className={`${ROW_HEIGHTS.header} flex flex-col justify-end pb-4 pl-4`}>
                   <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">Service<br/>Blueprint</h1>
                   <p className="text-sm font-medium text-slate-500 mt-1">Hospital Gloria</p>
                </div>
                <div className={`${ROW_HEIGHTS.evidencia} flex flex-col justify-center p-4 bg-white border-l-4 border-slate-400 font-bold text-slate-700`}>Evidencia Física<span className="font-normal text-xs text-slate-400 mt-1">Lo que el paciente ve y toca</span></div>
                <div className={`${ROW_HEIGHTS.cliente} flex flex-col justify-center p-4 bg-blue-50 border-l-4 border-blue-400 font-bold text-blue-800 mt-2`}>Acciones del Cliente<span className="font-normal text-xs text-blue-500 mt-1">Pasos secuenciales</span></div>
                
                <div className={`${ROW_HEIGHTS.separator} flex items-center justify-end pr-4 text-[11px] font-bold text-gray-400 tracking-widest`}>--- LÍNEA DE INTERACCIÓN ---</div>
                
                <div className={`${ROW_HEIGHTS.frontstage} flex flex-col justify-center p-4 bg-orange-50 border-l-4 border-orange-400 font-bold text-orange-800`}>Acciones Frontstage<span className="font-normal text-xs text-orange-500 mt-1">Personal en contacto directo</span></div>
                
                <div className={`${ROW_HEIGHTS.separator} flex items-center justify-end pr-4 text-[11px] font-bold text-gray-400 tracking-widest`}>--- LÍNEA DE VISIBILIDAD ---</div>
                
                <div className={`${ROW_HEIGHTS.backstage} flex flex-col justify-center p-4 bg-fuchsia-50 border-l-4 border-fuchsia-400 font-bold text-fuchsia-800`}>Acciones Backstage<span className="font-normal text-xs text-fuchsia-500 mt-1">Personal que opera sin ser visto</span></div>
                <div className={`${ROW_HEIGHTS.soporte} flex flex-col justify-center p-4 bg-slate-50 border-l-4 border-slate-400 font-bold text-slate-700 mt-2`}>Procesos de Soporte<span className="font-normal text-xs text-slate-400 mt-1">Sistemas y logística interna</span></div>
              </div>

              {stages.map((stage: any, idx) => (
                stage.isDelay ? (
                  <DelayCol key="delay" />
                ) : (
                  <div key={stage.id} className="w-72 flex flex-col flex-shrink-0 relative">
                    <div className={`${ROW_HEIGHTS.header} flex items-end pb-4 border-b-2 border-gray-200 mb-4 px-2`}>
                       <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                         {stage.title}
                         {stage.zoomable && (
                           <button onClick={() => setZoomed(true)} className="ml-auto bg-blue-100 text-blue-700 hover:bg-blue-200 p-1.5 rounded-md flex items-center gap-1 transition-colors shadow-sm cursor-pointer" title="Zoom: Detalle de Espera">
                             <ZoomIn size={16} />
                             <span className="text-xs font-bold uppercase tracking-wider">Zoom In</span>
                           </button>
                         )}
                       </h2>
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.evidencia} py-2`}>
                       <EvidenciaBlock items={stage.evidencia.items} failPoints={stage.evidencia.failPoints} />
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.cliente} py-2 mt-2`}>
                       <Block data={stage.cliente} type="cliente" />
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.separator} flex items-center w-full`}>
                       <div className="w-full border-t-[2px] border-dashed border-gray-300"></div>
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.frontstage} py-2`}>
                       <Block data={stage.frontstage} type="frontstage" />
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.separator} flex items-center w-full`}>
                       <div className="w-full border-t-[2px] border-dashed border-gray-300"></div>
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.backstage} py-2`}>
                       <Block data={stage.backstage} type="backstage" />
                    </div>
                    
                    <div className={`${ROW_HEIGHTS.soporte} py-2 mt-2`}>
                       <Block data={stage.soporte} type="soporte" />
                    </div>
                  </div>
                )
              ))}

           </div>
        </div>
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 bg-black/60 z-50 flex py-10 px-4 justify-center items-center backdrop-blur-sm">
             <motion.div initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}} exit={{scale: 0.95, opacity: 0}} className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
                <button onClick={() => setZoomed(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <X size={24} />
                </button>
                
                <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center gap-3">
                  <ZoomIn size={32} className="text-blue-600" /> Zoom: Etapa C (Intersección de Flujos)
                </h2>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
                  <p className="text-gray-700 text-lg font-medium">
                    La sala de espera experimenta un punto de dolor crítico debido a la competencia invisible por recursos entre dos flujos de pacientes coexistentes.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Flujo P3 */}
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative shadow-sm">
                     <div className="absolute top-0 left-0 w-2 h-full bg-blue-400 rounded-l-xl"></div>
                     <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">P3: Casos Rutinarios</h3>
                     <p className="text-sm text-slate-500 mb-6 font-medium">Forman el grueso de la cola. Su flujo es constantemente desplazado por casos de alta prioridad (P1/P2/P2+).</p>
                     
                     <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-4">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</div>
                           <p className="text-sm font-medium text-slate-700">Llegan caminando, reciben ticket y aguardan en sala.</p>
                        </div>
                        <div className="flex justify-center text-slate-300"><ArrowDown size={20} /></div>
                        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-4 relative ring-2 ring-red-100">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
                           <p className="text-sm font-medium text-slate-700">Monitorean las pantallas (sobreestiman el tiempo). Ansiedad por falsas expectativas.</p>
                           <AlertCircle className="absolute -right-3 -top-3 text-red-500 bg-white rounded-full" size={24} />
                        </div>
                        <div className="flex justify-center text-slate-300"><ArrowDown size={20} /></div>
                        <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex items-center gap-4">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</div>
                           <p className="text-sm font-medium text-amber-700 opacity-90">Su posición en la cola retrocede al ceder paso a las prioridades urgentes (P1) e inamovibles (P2/P2+).</p>
                           <Hourglass className="text-orange-400 ml-auto" size={20} />
                        </div>
                     </div>
                  </div>

                  {/* Flujo P1 / P2 */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100 relative shadow-sm">
                     <div className="absolute top-0 left-0 w-2 h-full bg-red-500 rounded-l-xl"></div>
                     <h3 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">P1 / P2 / P2+: Alta Prioridad</h3>
                     <p className="text-sm text-red-600 mb-6 font-medium">P1 son impredecibles; P2/P2+ tienen tiempos fijos obligatorios por política. Desplazan y detienen a P3.</p>
                     
                     <div className="flex flex-col gap-4">
                        <div className="bg-white p-4 rounded border border-red-200 shadow-sm flex items-center gap-4">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">!</div>
                           <p className="text-sm font-medium text-slate-700">P1 llega imprevisto (ej. ambulancia). P2/P2+ demandan atención bajo límites de tiempo fijo.</p>
                        </div>
                        <div className="flex justify-center text-red-300"><ArrowDown size={20} /></div>
                        <div className="bg-red-500 text-white p-4 rounded shadow-md flex items-center gap-4">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white/20 flex items-center justify-center font-bold">⚡</div>
                           <p className="text-sm font-bold">Derecho de paso automático que bypassea la sala de espera común.</p>
                        </div>
                        <div className="flex justify-center text-red-300"><ArrowDown size={20} /></div>
                        <div className="bg-white p-4 rounded border border-red-200 shadow-sm flex items-center gap-4 relative">
                           <div className="w-8 h-8 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold">✗</div>
                           <p className="text-sm font-medium text-slate-700">Médicos abandonan las consultas P3 para atender a estas urgencias que toman precedencia.</p>
                        </div>
                     </div>
                  </div>

                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
