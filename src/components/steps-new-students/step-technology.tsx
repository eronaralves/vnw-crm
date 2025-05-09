import { useFormContext } from 'react-hook-form'

export function StepTechnology() {
  const { register } = useFormContext()

  return (
    <div className="flex-1">
      <h1>Tecnologia</h1>
    </div>
  )
}
