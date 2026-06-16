import './card.css'

const Card = ({ image, data, language, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <div className="card-image">
                <img src={image} alt={data.subtitle[language]} />
            </div>
            <div className="card-header">
                <h2>{data.subtitle[language]}</h2>
            </div>
            <div className="card-text">
                <p>{data.text[language]}</p>
            </div>
        </div>
    )
}

export default Card
