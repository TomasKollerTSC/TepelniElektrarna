import Card from './Card';
import './bottomPart.css';
import { mediaUrl } from '../../../shared/backscreen/useContent';
import { photoFor } from '../../../shared/backscreen/schema';

const BottomPart = ({ cards, language, switchTab }) => {
  return (
    <section className="bottom">
      <div className="card-slider">
        {cards.map(c => (
          <Card
            key={c.id}
            image={mediaUrl(photoFor(c.photo, language))}
            title={c.label[language]}
            text={c.intro[language]}
            onTap={switchTab(c.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default BottomPart;
