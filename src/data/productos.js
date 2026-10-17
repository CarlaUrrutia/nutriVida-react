import imgGordito from '../assets/img/gordito.jpg';
import imgManejo from '../assets/img/manejojpg.jpg';
import imgDeportiva from '../assets/img/deportiva.jpg';
import imgEmbarazadas from '../assets/img/embarazadas-700x467.jpg';
import imgAdultoMayor from '../assets/img/adultoMayor.jpg';
import imgTCA from '../assets/img/uu.jpg';

export const productosData = [
  {
    id: 1,
    nombre: 'Pérdida de Peso',
    descripcion: 'Evaluación nutricional completa con pauta alimentaria personalizada y medición de pliegues cutáneos para alcanzar tu peso ideal de forma saludable.',
    precio: 25000,
    imagen: imgGordito,
    link: '/producto'
  },
  {
    id: 2,
    nombre: 'Control Metabólico',
    descripcion: 'Plan orientado al manejo de enfermedades metabólicas como diabetes, hipertensión o colesterol alto, con seguimiento continuo y ajustes periódicos.',
    precio: 30000,
    imagen: imgManejo
  },
  {
    id: 3,
    nombre: 'Nutrición Deportiva',
    descripcion: 'Diseñado para deportistas que buscan mejorar su rendimiento, optimizar la recuperación muscular y alcanzar su composición corporal ideal.',
    precio: 28000,
    imagen: imgDeportiva
  },
  {
    id: 4,
    nombre: 'Nutrición Gestacional',
    descripcion: 'Acompañamiento nutricional durante el embarazo y lactancia para asegurar el bienestar de la madre y el desarrollo óptimo del bebé.',
    precio: 40000,
    imagen: imgEmbarazadas
  },
  {
    id: 5,
    nombre: 'Plan Adulto Mayor',
    descripcion: 'Alimentación adaptada a las necesidades del adulto mayor, favoreciendo la masa muscular, la salud ósea y la calidad de vida en esta etapa.',
    precio: 35000,
    imagen: imgAdultoMayor
  },
  {
    id: 6,
    nombre: 'Trastornos de la Conducta Alimentaria',
    descripcion: 'Abordaje especializado y empático para personas con anorexia, bulimia u otros TCA, trabajando en conjunto con un equipo multidisciplinario.',
    precio: 35000,
    imagen: imgTCA
  }
];