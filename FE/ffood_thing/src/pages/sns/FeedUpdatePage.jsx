import React, { useState, useRef, useEffect } from "react"
import imageIcon from "../../assets/image.svg"
import { Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Feed, FeedImages } from "./feed_data"
import "../../styles/sns/FeedWrite.css"

function FeedUpdatePage() {
  const { id } = useParams()
  const feedId = parseInt(id)
  const navigate = useNavigate()

  const [selectedImages, setSelectedImages] = useState([])
  const [checkedImages, setCheckedImages] = useState([])
  const [foodName, setFoodName] = useState("")
  const [description, setDescription] = useState("")
  const fileInputRef = useRef()

  useEffect(() => {
    const currentFeed = Feed.find((item) => item.feed_id === feedId)
    if (currentFeed) {
      setFoodName(currentFeed.food_name)
      setDescription(currentFeed.content)

      const images = FeedImages.filter((image) => image.feed_id === feedId)
      const previews = images.map((image) => ({
        id: image.image_url,
        file: null,
      }))
      setSelectedImages(previews)
      setCheckedImages(previews.map((image) => image.id))
    }

    // Check if there are saved changes and prompt the user to load them
    const savedFoodName = localStorage.getItem(`foodName_${feedId}`)
    const savedDescription = localStorage.getItem(`description_${feedId}`)
    const savedImages = localStorage.getItem(`selectedImages_${feedId}`)
    const savedCheckedImages = localStorage.getItem(`checkedImages_${feedId}`)

    if (savedFoodName || savedDescription || savedImages || savedCheckedImages) {
      Swal.fire({
        title: "이전에 저장한 임시 데이터가 있습니다. 불러올까요?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "불러오기",
        denyButtonText: `불러오지 않기`,
      }).then((result) => {
        if (result.isConfirmed) {
          if (savedFoodName) setFoodName(savedFoodName)
          if (savedDescription) setDescription(savedDescription)
          if (savedImages) setSelectedImages(JSON.parse(savedImages))
          if (savedCheckedImages) setCheckedImages(JSON.parse(savedCheckedImages))
          Swal.fire("불러오기 완료!", "", "success")
        } else if (result.isDenied) {
          localStorage.removeItem(`foodName_${feedId}`)
          localStorage.removeItem(`description_${feedId}`)
          localStorage.removeItem(`selectedImages_${feedId}`)
          localStorage.removeItem(`checkedImages_${feedId}`)
          Swal.fire("임시 저장 데이터를 삭제했습니다.", "", "info")
        }
      })
    }
  }, [feedId])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
    }))
    setSelectedImages((prev) => [...prev, ...previews])
  }

  const handleCheck = (id) => {
    setCheckedImages((prev) => (prev.includes(id) ? prev.filter((imgId) => imgId !== id) : [...prev, id]))
  }

  const temporarySave = () => {
    localStorage.setItem(`selectedImages_${feedId}`, JSON.stringify(selectedImages))
    localStorage.setItem(`checkedImages_${feedId}`, JSON.stringify(checkedImages))
    localStorage.setItem(`foodName_${feedId}`, foodName)
    localStorage.setItem(`description_${feedId}`, description)
    console.log("임시저장 완료")
  }

  const handleBack = () => {
    Swal.fire({
      title: "변경사항을 임시저장하고 나갈까요?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "임시저장",
      denyButtonText: `임시저장하지 않기`,
    }).then((result) => {
      if (result.isConfirmed) {
        temporarySave()
        Swal.fire("임시저장!", "", "success").then(() => navigate(-1))
      } else if (result.isDenied) {
        Swal.fire("임시 저장하지 않기", "", "info").then(() => navigate(-1))
      }
    })
  }

  const handleNavigate = (path) => {
    temporarySave()
    navigate(path)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const imagesToUpload = selectedImages.filter((img) => checkedImages.includes(img.id))
    console.log("업로드할 이미지:", imagesToUpload)

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success me-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    })

    swalWithBootstrapButtons
      .fire({
        title: "정말 수정을 완료할까요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "수정완료!",
        cancelButtonText: "취소!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          // 폼 제출 후 localStorage 비우기
          localStorage.removeItem(`selectedImages_${feedId}`)
          localStorage.removeItem(`checkedImages_${feedId}`)
          localStorage.removeItem(`foodName_${feedId}`)
          localStorage.removeItem(`description_${feedId}`)
          swalWithBootstrapButtons
            .fire({
              title: "수정완료!",
              text: "성공적으로 피드가 수정됐어요.",
              imageUrl: "/images/mainlogo.jpg",
              imageWidth: 350,
              imageHeight: 300,
              imageAlt: "Custom image",
              icon: "success",
            })
            .then(() => navigate(-1))
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "수정 취소!",
            text: "수정을 취소했어요.",
            icon: "error",
          })
        }
      })
  }

  return (
    <div className="base-div">
      <div className="card-div">
        <div className="div-80">
          <button onClick={handleBack} className="back-button">
            <img src="/images/previous_button.png" alt="Previous" className="icon" />
            이전
          </button>
          <form onSubmit={handleSubmit}>
            <div className="preview-container">
              {selectedImages.map((image) => (
                <div key={image.id} className="preview-image">
                  <div className="square">
                    <img src={image.id} alt="미리보기" />
                  </div>
                  <input type="checkbox" className="checkbox" onChange={() => handleCheck(image.id)} checked={checkedImages.includes(image.id)} />
                </div>
              ))}
            </div>

            <div className="file-upload" onClick={() => fileInputRef.current.click()}>
              <img src={imageIcon} alt="이미지 아이콘" />
              <p>이미지 선택</p>
              <input type="file" ref={fileInputRef} id="imageUpload" name="imageUpload" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageChange} />
            </div>

            <hr className="featurette-divider" />

            <Form.Control size="lg" type="text" placeholder="음식명" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
            <br />
            <Form.Control type="text" placeholder="문구 추가..." value={description} onChange={(e) => setDescription(e.target.value)} />

            {/* 참고한 레시피 섹션 */}
            <div className="recipe-section">
              <h5>참고한 레시피</h5>
              <div className="button-container">
                <button type="button" className="btn btn-secondary" onClick={() => handleNavigate("/recipes")}>
                  레시피 검색
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => handleNavigate("/profile/1?tab=bookmarks")}>
                  내 북마크에서 찾기
                </button>
              </div>
            </div>

            <div className="submit-button">
              <button type="submit" className="btn btn-primary">
                수정 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FeedUpdatePage
