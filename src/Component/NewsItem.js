import React from 'react';

const NewsItem = ({ title, description, imageUrl, newsUrl, author, date, source }) => {
  return (

    <div className="my-3 mx-2"> 
      <div className="card">
        <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{ left: '90%', zIndex: '1' }}>
          {source}
        </span>
        <img src={imageUrl} className="card-img-top" alt="News Thumbnail" />
        <div
          className="card-body"
          style={{ background: 'aquamarine',color:'black' }}  
        >
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-muted">
              By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}
            </small>
          </p>
          <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">Read more</a>
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
