import React, { useRef, useState, useEffect } from "react"
import "../../styles/recipe/CookingDonePage.css"

const CookingDonePage = ({ recipe, handleFeed, onClose, onPrevPage }) => {
  const representativeImage = recipe.image || "/default-image.png"
  const canvasRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [defaultImageVisible, setDefaultImageVisible] = useState(true)
  const [overlayVisible, setOverlayVisible] = useState(false)

  useEffect(() => {
    if (canvasRef.current && capturedImage) {
      const img = new Image()
      img.onload = () => {
        const context = canvasRef.current.getContext("2d")
        const canvas = canvasRef.current
        const hRatio = canvas.width / img.width
        const vRatio = canvas.height / img.height
        const ratio = Math.max(hRatio, vRatio)
        const centerX = (canvas.width - img.width * ratio) / 2
        const centerY = (canvas.height - img.height * ratio) / 2
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0, img.width, img.height, centerX, centerY, img.width * ratio, img.height * ratio)
      }
      img.src = capturedImage
    }
  }, [capturedImage])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCapturedImage(reader.result)
        setDefaultImageVisible(false)
        setOverlayVisible(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeedWithImage = () => {
    handleFeed(recipe, capturedImage)
  }

  const handleEditImage = () => {
    setCapturedImage(null)
    setDefaultImageVisible(true)
    setOverlayVisible(false)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  return (
    <div className="card-div-done">
      <div className="cooking-done-container">
        <h2>맛있는 결과물 완성</h2>
        <div className="comparison-container">
          <div className="cooked-dish-container">
            <div className="image-frame">
              {!capturedImage && defaultImageVisible && (
                <>
                  <img src="/images/camera-icon.png" alt="Camera Icon" className="camera-icon" />
                  <p className="camera-text">내가 완성한 요리를 사진으로 남겨봐요!</p>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="file-input" />
              <canvas ref={canvasRef} className="cooked-dish-canvas" />
              {capturedImage && overlayVisible && (
                <div className="image-overlay">
                  <button className="overlay-button" onClick={handleFeedWithImage}>
                    업로드하기
                    <img src="/images/feedicon.png" alt="나만의 요리 기록하기" className="button-image" />
                  </button>
                  <button className="overlay-button" onClick={handleEditImage}>
                    사진 다시 고르기
                    <img src="/images/edit-icon.png" alt="이미지 다시 고르기" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="back-to-recipe-button" onClick={onPrevPage}>
          back to recipe
          <img src="/images/recipe-icon.png" alt="레시피로 복귀" className="button-image" />
        </div>
        <div className="done-button-container">
          <img className="process-exit-btn" src="/images/exit-btn.png" alt="" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}

export default CookingDonePage
