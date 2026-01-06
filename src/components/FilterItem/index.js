import './index.css'

const FilterItem = props => {
  const {filterDetails, filterTypeValue, onChangeHandler} = props
  const {label, employmentTypeId, salaryRangeId} = filterDetails

  const id = employmentTypeId || salaryRangeId

  return (
    <div className="filter-option">
      <input
        id={id}
        type={filterTypeValue}
        name={filterTypeValue === 'radio' ? 'salary-ranges' : 'employee-types'}
        value={id}
        className="input"
        onChange={event => onChangeHandler(event, filterTypeValue)}
      />
      <label htmlFor={id} className="label">
        {label}
      </label>
    </div>
  )
}

export default FilterItem
