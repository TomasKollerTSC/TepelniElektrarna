import Card from './Card';
import './bottomPart.css';

const BottomPart = ({ tabs, tabPhoto, labels, content, language, switchTab }) => {
  return (
    <section className="bottom">
      <div className="card-slider">
        {tabs.map(t => (
          <Card
            key={t}
            image={tabPhoto(t, language)}
            data={{
              subtitle: { cz: labels.cz[t], en: labels.en[t], de: labels.de[t] },
              text: { cz: content.cz[t].intro, en: content.en[t].intro, de: content.de[t].intro },
            }}
            language={language}
            onClick={switchTab(t)}
          />
        ))}
      </div>
    </section>
  );
};

export default BottomPart;
