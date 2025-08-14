import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    document.title = `${props.category} - X-Times`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const updateNews = async () => {
    props.setProgress(30);
    let url = "";

    if (props.category === "anime") {
      url = `https://newsapi.org/v2/everything?q=anime&apiKey=b9ca3dbb348e43698eae63db80af119e&page=${page}&pageSize=${props.pageSize}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=b9ca3dbb348e43698eae63db80af119e&page=${page}&pageSize=${props.pageSize}`;
    }

    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    let url = "";

    if (props.category === "anime") {
      url = `https://newsapi.org/v2/everything?q=anime&apiKey=b9ca3dbb348e43698eae63db80af119e&page=${nextPage}&pageSize=${props.pageSize}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=b9ca3dbb348e43698eae63db80af119e&page=${nextPage}&pageSize=${props.pageSize}`;
    }

    let data = await fetch(url);
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.articles));
    setPage(nextPage);
    setTotalResults(parsedData.totalResults);
  };

  return (
    <div className='container my-3'>
      <h1 className="text-center" style={{ marginTop: '90px' }}>X-Times - Top Headlines</h1>

      {loading && <h4>Loading...</h4>}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<h4>Loading more...</h4>}
      >
        <div className="row">
          {articles.map((element) => (
            <div className="col-md-3" key={element.url}>
              <NewsItem
                title={element.title ? element.title : ""}
                description={element.description ? element.description : ""}
                imageUrl={element.urlToImage}
                newsUrl={element.url}
                author={element.author}
                date={element.publishedAt}
                source={element.source.name}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: 'us',
  pageSize: 8,
  category: 'general'
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func
};

export default News;
