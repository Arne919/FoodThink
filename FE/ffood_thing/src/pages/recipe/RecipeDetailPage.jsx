import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import RecipeComponent from "../../components/recipe/RecipeComponent"
import HandPoseComponent from "../../components/handmotion/HandPoseComponent"
import SearchBar from "../../components/base/SearchBar"
import Swal from "sweetalert2"
import "../../styles/recipe/RecipeDetailPage.css"

const RecipeDetailPage = () => {
  const { id } = useParams() // URL 파라미터에서 ID를 가져옴
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // currentStep 상태 추가
  const [activeSection, setActiveSection] = useState("ingredients")
  const [isBookmarked, setIsBookmarked] = useState(false)

  const ingredientsRef = useRef(null)
  const stepsRef = useRef(null)
  const completedRef = useRef(null)
  const feedRef = useRef(null)

  // 서버에서 레시피 데이터를 가져오는 useEffect 훅
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log("Fetching recipe with ID:", id) // ID 값 확인 로그
        const response = await axios.get(`https://i12e107.p.ssafy.io/api/recipes/read/detail/${id}`)
        setRecipe(response.data)
      } catch (error) {
        console.error("Error fetching recipe details", error)
      }
    }

    fetchRecipe()
  }, [id])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    }

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Intersecting:", entry.target.id)
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (ingredientsRef.current) observer.observe(ingredientsRef.current)
    if (stepsRef.current) observer.observe(stepsRef.current)
    if (completedRef.current) observer.observe(completedRef.current)
    if (feedRef.current) observer.observe(feedRef.current)

    return () => {
      if (ingredientsRef.current) observer.unobserve(ingredientsRef.current)
      if (stepsRef.current) observer.unobserve(stepsRef.current)
      if (completedRef.current) observer.unobserve(completedRef.current)
      if (feedRef.current) observer.unobserve(feedRef.current)
    }
  }, [])

  if (!recipe) {
    return <div>Loading...</div>
  }

  const handleBookmarkClick = () => {
    if (isBookmarked) {
      Swal.fire({
        title: "북마크 취소!",
        text: "북마크에서 제거했어요.",
        icon: "error",
      }).then(() => {
        setIsBookmarked(false)
      })
    } else {
      Swal.fire({
        title: "북마크완료!",
        text: "북마크에 추가했어요",
        imageUrl: "/images/mainlogo.jpg",
        imageWidth: 350,
        imageHeight: 300,
        imageAlt: "Custom image",
        icon: "success",
      }).then(() => {
        setIsBookmarked(true)
      })
    }
  }

  const getLevelText = (level) => {
    switch (level) {
      case 1:
        return "하"
      case 2:
        return "중"
      case 3:
        return "상"
      default:
        return level
    }
  }

  const scrollToSection = (section) => {
    setActiveSection(section)
    document.getElementById(section).scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="base-div">
      <SearchBar />
      <div className="parent-container">
        <div className="card-div-topsection">
          <div style={{ width: "90%", margin: "0 auto" }}>
            <button onClick={() => navigate(-1)} className="back-button1">
              <img src="/images/previous_button.png" alt="Previous" className="icon" />
              이전
            </button>

            <div style={{ display: "flex", gap: "2rem", marginBottom: "100px" }}>
              <div className="recipe-main-images" style={{ flex: "0 0 60%", position: "relative" }}>
                <img src={recipe.image} alt="Recipe Image" className="recipe-image1" />
                <button className="bookmark-icon-btn" onClick={handleBookmarkClick}>
                  <img src={isBookmarked ? "/images/do-Bookmark.png" : "/images/undo-Bookmark.png"} alt="북마크 아이콘" className="bookmark-icon" />
                </button>
                <div className="hit-eye-icon-area">
                  <img src="/images/hit-eye.png" alt="" className="hit-eye-icon" />
                  <p>{recipe.hits}</p>
                </div>
                <img src={recipe.userImage} alt="프로필이미지" className="profile-image" />
                <div className="nickname-container">
                  <h2 className="nickname-area">{recipe.nickname}</h2>
                  <button className="sub-btn">구독</button>
                </div>
              </div>

              <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="title-container">
                  <h1>{recipe.recipeTitle}</h1>
                </div>
                <div className="icon-container">
                  <div className="icon-item">
                    <img src="/images/serving.png" alt="Serving" />
                    <p>{recipe.serving}</p>
                  </div>
                  <div className="icon-item">
                    <img src="/images/level.png" alt="Level" />
                    <p>{getLevelText(recipe.level)}</p>
                  </div>
                  <div className="icon-item">
                    <img src="/images/timerequired.png" alt="Time Required" />
                    <p>{recipe.requiredTime}</p>
                  </div>
                </div>

                <button className="cook-btn" onClick={() => setShowModal(true)}>
                  조리시작
                </button>
              </div>
            </div>

            {showModal && (
              <div className="modal-overlay3">
                <div className="modal-content3">
                  <button className="close-button3" onClick={() => setShowModal(false)}>
                    X
                  </button>
                  <HandPoseComponent
                    currentStep={currentStep}
                    onNextStep={() => setCurrentStep((prevStep) => prevStep + 1)}
                    onPrevStep={() => setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))}
                    pages={recipe.processes} // 서버에서 가져온 데이터를 HandPoseComponent로 전달
                  />
                  <RecipeComponent pages={recipe.processes} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Navigation Bar */}
      <div className="card-div-firstsection">
        <button className={activeSection === "ingredients" ? "active" : ""} onClick={() => scrollToSection("ingredients")}>
          재료
        </button>
        <button className={activeSection === "steps" ? "active" : ""} onClick={() => scrollToSection("steps")}>
          조리순서
        </button>

        <button className={activeSection === "feed" ? "active" : ""} onClick={() => scrollToSection("feed")}>
          FEED
        </button>
      </div>

      {/* Sections */}
      <div className="parent-container">
        <div id="ingredients" ref={ingredientsRef} className="card-div-section">
          <h1 className="section-title">재료</h1>
          <div className="left-half">
            {recipe.ingredients.map((ingredient, index) => {
              if (index % 2 === 0) {
                return (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.ingreName}</span>
                    <span>{ingredient.amount}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
          <div className="right-half">
            {recipe.ingredients.map((ingredient, index) => {
              if (index % 2 !== 0) {
                return (
                  <div key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.ingreName}</span>
                    <span>{ingredient.amount}</span>
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
      {/* Steps Section */}
      <div className="parent-container">
        <div id="steps" ref={stepsRef} className="card-div-section">
          <h1 className="section-title">조리순서</h1>
          <div className="steps">
            {recipe.processes.map((process, index) => (
              <div key={index} className="process-item">
                <h2>
                  {process.processOrder}. {process.processExplain}
                </h2>
                {process.images && process.images.map((image, imgIndex) => <img key={imgIndex} src={image.imageUrl} alt={`Process ${process.processOrder}`} className="process-image" />)}
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="parent-container">
        <div id="feed" ref={feedRef} className="card-div-section">
          <h1 className="section-title">관련 Feed</h1>
          {/* Feed 내용 추가 */}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
