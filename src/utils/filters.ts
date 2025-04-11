const filtersTableStudents = [
  {
    id: 'course_options',
    name: 'Curso',
    value: 'course_name',
    options: [],
  },
  {
    name: 'Turma',
    options: ['Manhã', 'Tarde', 'Noite'],
    value: 'group',
  },
  {
    id: 'modality_options',
    name: 'Modalidade',
    options: [],
    value: 'modality',
  },
  {
    id: 'language_options',
    name: 'Linguagem',
    options: [],
    value: 'programing_language',
  },
  {
    id: 'sexuality_options',
    name: 'Orientação sexual',
    options: [],
    value: 'sexuality',
  },
  {
    id: 'gender_options',
    name: 'Gênero',
    options: [],
    value: 'gender',
  },
  {
    name: 'Motivo de Evasão',
    value: 'reason_give_up',
    options: [
      'Sem resposta',
      'Conflito de horários',
      'Trabalho',
      'Dificuldades técnicas',
    ],
  },
  {
    id: 'city_options',
    name: 'Cidade',
    options: [],
    value: 'city',
  },
  {
    id: 'state_options',
    name: 'UF',
    options: [],
    value: 'state',
  },
  {
    name: 'Estuda',
    options: ['Sim', 'Não'],
    value: 'study',
  },
  {
    name: 'Empregado',
    options: ['Sim', 'Não'],
    value: 'work',
  },
]

const filtersTableLeads = [
  {
    id: 'sexuality_options',
    name: 'Orientação sexual',
    options: [],
    value: 'sexuality_in',
  },
  {
    id: 'gender_options',
    name: 'Gênero',
    options: [],
    value: 'gender_in',
  },
  {
    id: 'skin_color_options',
    name: 'Raça/Cor',
    options: [],
    value: 'skin_color_in',
  },
  {
    id: 'course_options',
    name: 'Curso',
    options: [],
    value: 'interested_course_in',
  },
  {
    id: 'income_options',
    name: 'Renda',
    options: [],
    value: 'income_range_in',
  },
  {
    id: 'community_options',
    name: 'Comunidade',
    options: [],
    value: 'community_in',
  },
  {
    id: 'city_options',
    name: 'Cidade',
    options: [],
    value: 'city_in',
  },
  {
    id: 'state_options',
    name: 'UF',
    options: [],
    value: 'state_in',
  },
]

export { filtersTableStudents, filtersTableLeads }
