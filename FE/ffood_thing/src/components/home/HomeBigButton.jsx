import React from "react"
import "../../styles/home/HomeBigButton.css"
import { Link } from "react-router-dom"

const HomeBigButton = () => {
  return (
    <div className="card-div">
      <div className="container px-4 py-5" id="custom-cards">
        <div className="row">
          <div className="col">
            {/* 왼쪽 열 */}
            <Link to="/recipes" className="card-link">
              <div className="card card-1" style={{ backgroundImage: `url(/images/메인페이지1.jpg)` }}>
                <div className="content">
                  <h1>레시피</h1>
                  <h4>수만가지 레시피를 확인해보세요.</h4>
                </div>
              </div>
            </Link>

            <Link to="/ai-recommend" className="card-link">
              <div className="card card-3" style={{ backgroundImage: `url(/images/메인페이지3.jpg)` }}>
                <div className="content">
                  <h1>AI 음식 추천</h1>
                  <h4>내 맞춤 음식 추천을 받아보세요.</h4>
                </div>
              </div>
            </Link>
          </div>

          <div className="col">
            {/* 오른쪽 열 */}
            <Link to="/today-recommend" className="card-link">
              <div className="card card-2" style={{ backgroundImage: `url(/images/메인페이지2.jpg)` }}>
                <div className="content">
                  <h1>오늘 뭐 먹지?</h1>
                  <h4>오늘 먹을 음식을 추천받아보세요.</h4>
                </div>
              </div>
            </Link>

            <Link to="/sns" className="card-link">
              <div className="card card-4" style={{ backgroundImage: `url(/images/메인페이지4.jpg)` }}>
                <div className="content">
                  <h1>SNS</h1>
                  <h4>내가 만든 음식을 공유해봐요.</h4>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBigButton
