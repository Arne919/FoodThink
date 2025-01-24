import React from "react"
import "../../styles/home/HomeBigButton.css"
import { Link } from "react-router-dom"

const HomeBigButton = () => {
  const cards = [
    {
      id: 1,
      backgroundImage: "/images/메인페이지1.jpg",
      title: "레시피",
      location: "수만가지 레시피를 확인해보세요.",
      link: "/recipes", // 링크 경로 추가
    },
    {
      id: 2,
      backgroundImage: "/images/메인페이지2.jpg",
      title: "오늘 뭐 먹지?",
      location: "오늘 먹을 음식을 추천받아보세요.",
      link: "/today-recipe", // 링크 경로 추가
    },
    {
      id: 3,
      backgroundImage: "/images/메인페이지3.jpg",
      title: "AI 음식 추천",
      location: "내 맞춤 음식 추천을 받아보세요.",
      link: "/ai-recipe", // 링크 경로 추가
    },
    {
      id: 4,
      backgroundImage: "/images/메인페이지4.jpg",
      title: "SNS",
      location: "내가 만든 음식을 공유해봐요.",
      link: "/sns", // 링크 경로 추가
    },
  ]

  return (
    <div className="card-div">
      <div className="container px-4 py-5" id="custom-cards">
        <div className="custom-grid">
          {cards.map((card) => (
            <div className={`card card-${card.id}`} key={card.id}>
              <div className="content">
                <h3>{card.title}</h3>
                <p>{card.location}</p>
                <Link to={card.link}>
                  <button className="rounded-button">이동하기</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeBigButton
