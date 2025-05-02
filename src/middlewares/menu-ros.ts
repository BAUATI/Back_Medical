export enum ValidRols {
  administrativo = 'ADMINISTRATIVO',
  paciente = 'PACIENTE',
  profesional = 'PROFESIONAL'
}

export const MenuSiderbar = (rols: string[]) => {
  const menu: { title: string; subtitle: string; url: string }[] = [];

  // Menú base para todos los usuarios
  menu.push({
      title: 'Inicio',
      subtitle: 'Panel principal',
      url: '/dashboard'
  });

  // Menú para pacientes
  if (rols.includes(ValidRols.paciente)) {
      menu.push(
          {
              title: 'Mis Citas',
              subtitle: 'Reservar o gestionar citas',
              url: '/citas'
          },
          {
              title: 'Historial Clínico',
              subtitle: 'Consultar historial médico',
              url: '/historial'
          },
          {
              title: 'Prescripciones',
              subtitle: 'Ver recetas médicas',
              url: '/prescripciones'
          },
          {
              title: 'Perfil',
              subtitle: 'Actualizar datos personales',
              url: '/perfil'
          }
      );
  }

  // Menú para profesionales
  if (rols.includes(ValidRols.profesional)) {
      menu.push(
          {
              title: 'Agenda',
              subtitle: 'Ver citas programadas',
              url: '/agenda'
          },
          {
              title: 'Atenciones',
              subtitle: 'Registrar atenciones médicas',
              url: '/atenciones'
          },
          {
              title: 'Prescripciones',
              subtitle: 'Emitir recetas médicas',
              url: '/prescripciones'
          },
          {
              title: 'Horarios',
              subtitle: 'Consultar horarios asignados',
              url: '/horarios'
          }
      );
  }

  // Menú para administrativos
  if (rols.includes(ValidRols.administrativo)) {
      menu.push(
          {
              title: 'Sedes',
              subtitle: 'Gestionar sedes médicas',
              url: '/sedes'
          },
          {
              title: 'Consultorios',
              subtitle: 'Gestionar consultorios',
              url: '/consultorios'
          },
          {
              title: 'Usuarios',
              subtitle: 'Gestionar pacientes y profesionales',
              url: '/usuarios'
          },
          {
              title: 'Horarios',
              subtitle: 'Configurar horarios de atención',
              url: '/horarios'
          },
          {
              title: 'Reportes',
              subtitle: 'Ver estadísticas operativas',
              url: '/reportes'
          }
      );
  }

  return menu;
};