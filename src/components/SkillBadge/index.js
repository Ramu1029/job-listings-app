import './index.css'

const SkillBadge = props => {
  const {skillDetails} = props
  const {name, imageUrl} = skillDetails

  return (
    <li className="skill-item">
      <img src={imageUrl} className="skill-img" alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default SkillBadge
