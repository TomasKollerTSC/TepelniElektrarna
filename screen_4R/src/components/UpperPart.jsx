import './upperPart.css';

const UpperPart = ({ photo, source }) => {
  return (
    <section className="upper">
      <div className="photo-frame">
        {photo && <img src={photo} alt="" className="photo-main" />}
      </div>
      {photo && source && <span className="photo-source">{source}</span>}
    </section>
  );
};

export default UpperPart;
