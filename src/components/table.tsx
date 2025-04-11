// import { Checkbox } from "./ui/checkbox"
// import { Table as UiTable, TableHeader, TableRow, TableHead } from "./ui/table"

// export function Table() {
//   return (
//     <UiTable>
//       <TableHeader className=" bg-[#f5f5fa]">
//         <TableRow>
//           <TableHead className="w-[50px] px-5 text-left whitespace-nowrap z-50 overflow-visible">
//             <Checkbox
//               className="w-5 h-5"
//               checked={allChecked}
//               onCheckedChange={(checked) => {
//                 if (checked) {
//                   setSelectedStudents(
//                     data?.students
//                       ? data?.students?.map((student) => student.id)
//                       : [],
//                   )
//                   setAllChecked(true)
//                 } else {
//                   setSelectedStudents([])
//                   setAllChecked(false)
//                 }
//               }}
//             />
//           </TableHead>

//           <TableHead className="w-[400px] px-5 pb-5 pl-[60px] text-left whitespace-nowrap overflow-visible">
//             <div className=" flex flex-col gap-2">
//               <strong className="text-sm font-bold text-black">Aluno</strong>
//               <span className="text-[#80838e] font-normal m-0">ID</span>
//             </div>
//           </TableHead>

//           <TableHead className="w-[300px] px-5 pb-5 text-left whitespace-nowrap">
//             <div className="flex flex-col gap-2">
//               <strong className="text-sm font-bold text-black">Contato</strong>
//               <span className=" text-[#80838e] font-normal m-0 ">
//                 E-mail e Celular
//               </span>
//             </div>
//           </TableHead>

//           {filtersTable.map((filter) => (
//             <TableHead
//               key={filter.name}
//               className="px-5 pb-5 text-left whitespace-nowrap"
//             >
//               <div className="flex flex-col gap-2 z-50">
//                 <label className="text-black font-bold">{filter.name}</label>
//                 <Listbox
//                   value={searchParams.getAll(filter.value)}
//                   onChange={(value) => handleMultiSelect(filter.value, value)}
//                   multiple
//                 >
//                   <div className="relative w-[180px] overflow-visible">
//                     <ListboxButton className="z-50 w-full cursor-default rounded-lg overflow-visible bg-white py-2 pl-3 pr-10 text-left border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500">
//                       <span className="block truncate ">
//                         {params?.getAll(filter.value)?.length
//                           ? `${params?.getAll(filter.value)?.length} selecionado(s)`
//                           : 'Todos'}
//                       </span>
//                       <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
//                         <ChevronDown className="h-4 w-4 text-gray-400" />
//                       </span>
//                     </ListboxButton>
//                     <Transition
//                       as={Fragment}
//                       leave="transition ease-in duration-100"
//                       leaveFrom="opacity-100"
//                       leaveTo="opacity-0"
//                     >
//                       <ListboxOptions className="fixed  mt-1  overflow-visible z-[999px] rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         {filter?.options?.map((option, index) => (
//                           <ListboxOption
//                             key={index}
//                             value={option}
//                             className={({ active }) =>
//                               `relative z-[999px] cursor-default select-none py-2 pl-10 pr-4 ${
//                                 active
//                                   ? 'bg-blue-100 text-blue-900'
//                                   : 'text-gray-900'
//                               }`
//                             }
//                           >
//                             {({ selected }) => (
//                               <>
//                                 <span
//                                   className={`block truncate ${
//                                     selected ? 'font-medium' : 'font-normal'
//                                   }`}
//                                 >
//                                   {option}
//                                 </span>
//                                 {selected && (
//                                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
//                                     <Check className="w-4 h-4" />
//                                   </span>
//                                 )}
//                               </>
//                             )}
//                           </ListboxOption>
//                         ))}
//                       </ListboxOptions>
//                     </Transition>
//                   </div>
//                 </Listbox>
//               </div>
//             </TableHead>
//           ))}
//         </TableRow>
//       </TableHeader>

//       <TableBody className="flex-1">
//         {data?.students?.length !== 0
//           ? data?.students?.map((student) => (
//               <TableRow key={student?.errolmentId}>
//                 <TableCell className="p-5 whitespace-nowrap">
//                   <Checkbox
//                     className="w-5 h-5"
//                     checked={selectedStudents.includes(student.id)}
//                     onCheckedChange={() => toggleStudentSelection(student.id)}
//                   />
//                 </TableCell>
//                 <TableCell className="p-5 pl-[60px] whitespace-nowrap">
//                   <div className="flex flex-col gap-2">
//                     <strong className="text-sm font-bold text-[#1c1d21]">
//                       {student.fullname}
//                     </strong>
//                     <span className="text-xs text-[#1c1d21] ">
//                       ID {student.id}
//                     </span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="p-5 whitespace-nowrap">
//                   <div className="flex flex-col gap-2">
//                     <span className="text-xs text-[#1c1d21] ">
//                       {student.email}
//                     </span>
//                     <span className="text-xs text-[#1c1d21] ">
//                       {student.phone}
//                     </span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="p-5 whitespace-nowrap">
//                   <span className="text-xs text-[#1c1d21] ">
//                     {student.course.name}
//                   </span>
//                 </TableCell>

//                 {student.status === 'Evadiu' && (
//                   <TableCell className="p-5 whitespace-nowrap">
//                     <span className="text-xs text-[#1c1d21] ">
//                       {student.reason_give_up}
//                     </span>
//                   </TableCell>
//                 )}
//               </TableRow>
//             ))
//           : !isLoading && (
//               <TableRow>
//                 <TableCell
//                   colSpan={999}
//                   className="text-center py-10 text-gray-500"
//                 >
//                   Nenhum aluno encontrado.
//                 </TableCell>
//               </TableRow>
//             )}
//       </TableBody>
//     </UiTable>
//   )
// }
