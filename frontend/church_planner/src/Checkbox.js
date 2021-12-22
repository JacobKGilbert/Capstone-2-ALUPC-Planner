import { useState } from 'react'
import { Input } from 'reactstrap'

const Checkbox = ({ defCheck, idAndName, updateFormData }) => {
  const [ checked, setChecked ] = useState(defCheck)

  const handleChange = (evt) => {
    updateFormData(evt)
    setChecked(!checked)
  }

  return (
    <Input
      type="checkbox"
      id={`${idAndName}`}
      name={`${idAndName}`}
      value={checked}
      onChange={handleChange}
      checked={checked}
    />
  )
}

export default Checkbox