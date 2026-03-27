import './upperPart.css';

const UpperPart = ({ photo, source }) => {
  return (
    <section className="upper">
      <div className="photo-frame">
        <img src={photo} alt="" className="photo-main" />
      </div>
      <span className="photo-source">{source}</span>
    </section>
  );
};

export default UpperPart;
