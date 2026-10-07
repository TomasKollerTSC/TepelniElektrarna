import './card.css'
import { tap } from '../tap'

const Card = ({ image, title, text, onTap }) => {
    return (
        <div className="card" {...tap(onTap)}>
            <div className="card-image">
                {image && <img src={image} alt={title} />}
            </div>
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-text">
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Card
