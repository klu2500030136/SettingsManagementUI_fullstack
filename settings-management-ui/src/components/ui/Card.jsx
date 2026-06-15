function Card({ children, className = "" }) {
  return (
    <div className={`glass-card dark:glass-panel-dark ${className}`}>
      {children}
    </div>
  );
}

export default Card;