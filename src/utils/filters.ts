const filtersTableStudents = [
  {
    id: 'course_options',
    name: 'Curso',
    value: 'course_name',
    options: [],
  },
  {
    name: 'Turma',
    options: [
      { value: 'Manhã', label: 'Manhã' },
      { value: 'Tarde', label: 'Tarde' },
      { value: 'Noite', label: 'Noite' },
    ],
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
      { value: 'Sem resposta', label: 'Sem resposta' },
      { value: 'Conflito de horários', label: 'Conflito de horários' },
      { value: 'Trabalho', label: 'Trabalho' },
      { value: 'Dificuldades técnicas', label: 'Dificuldades técnicas' },
    ],
  },
  {
    name: 'Estuda',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
    ],
    value: 'study',
  },
  {
    name: 'Empregado',
    options: [
      { value: 'Sim', label: 'Sim' },
      { value: 'Não', label: 'Não' },
    ],
    value: 'work',
  },
  {
    id: 'community_options',
    name: 'Comunidade',
    options: [],
    value: 'community',
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
]

const filtersTableLeads = [
  {
    id: 'course_options',
    name: 'Curso Interessado',
    options: [],
    value: 'interested_course_in',
  },
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

const filtersTableJourney = [
  {
    id: 'course_options',
    name: 'Curso',
    value: 'course_name',
    options: [],
  },
]

export { filtersTableStudents, filtersTableLeads, filtersTableJourney }
