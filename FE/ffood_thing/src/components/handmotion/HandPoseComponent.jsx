import React, { useRef, useEffect, useState } from "react"
import { Holistic } from "@mediapipe/holistic"
import PropTypes from "prop-types"
import { Camera } from "@mediapipe/camera_utils"
import "../../styles/recipe/RecipeComponent.css"

const HandPoseComponent = ({ currentStep, onNextStep, onPrevStep, pages, recipeId }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const swipeTrackingRef = useRef({
    startX: null,
    isTracking: false,
    lastSwipeTimestamp: 0,
    cooldownPeriod: 1500, // 1.5초 쿨다운
    lastPositions: [],
  })
  const [swipeMessage, setSwipeMessage] = useState("")
  const [handDetected, setHandDetected] = useState(false)
  const [timer, setTimer] = useState(0) // 타이머 상태 추가
  const [isTimerRunning, setIsTimerRunning] = useState(false) // 타이머 실행 여부 상태 추가
  const [isRecording, setIsRecording] = useState(false) // 녹음 상태 추가
  const [lastServerResponse, setLastServerResponse] = useState(null) // 서버 응답 상태 추가
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false) // 알람 재생 상태 추가
  const [isRecordingModalVisible, setIsRecordingModalVisible] = useState(false) // 녹음 모달 상태 추가
  const alarmAudioRef = useRef(new Audio("/sound/Alarm.wav")) // 알람 소리 파일 경로 설정

  // 현재 단계 텍스트 상태
  const [currentProcessText, setCurrentProcessText] = useState("")
  const currentProcessRef = useRef(pages[currentStep]) // useRef로 currentProcess 참조

  useEffect(() => {
    // currentStep이 변경될 때마다 currentProcess 텍스트 업데이트
    if (pages[currentStep]) {
      const newCurrentProcess = pages[currentStep]
      const newCurrentProcessText = `${newCurrentProcess.processOrder}. ${newCurrentProcess.processExplain}`
      setCurrentProcessText(newCurrentProcessText)
      currentProcessRef.current = newCurrentProcess // useRef로 최신 currentProcess 유지
    }
  }, [currentStep, pages])

  // 효과음 재생
  const playSound = (url) => {
    const audio = new Audio(url)
    audio.play()
  }

  // 타이머 알람 재생 함수
  const playAlarm = () => {
    alarmAudioRef.current.currentTime = 0
    alarmAudioRef.current.play()
    setIsAlarmPlaying(true) // 알람 재생 상태를 true로 설정
  }

  // 타이머 알람 멈추기 함수
  const stopAlarm = () => {
    alarmAudioRef.current.pause()
    alarmAudioRef.current.currentTime = 0
    setIsAlarmPlaying(false) // 알람 재생 상태를 false로 설정
  }

  // 음성인식 필요 데이터
  const token = localStorage.getItem("accessToken")

  useEffect(() => {
    let timerInterval = null
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 3 && prevTimer > 1) {
            console.log(prevTimer) // 타이머가 3초 이하로 남았을 때 로그 출력
          }
          if (prevTimer === 1 && !isAlarmPlaying) {
            playAlarm() // 타이머가 1이 될 때 알람 소리 재생
          }
          return prevTimer > 0 ? prevTimer - 1 : 0 // 타이머 감소
        })
      }, 1000)
    } else {
      clearInterval(timerInterval)
    }
    return () => clearInterval(timerInterval)
  }, [isTimerRunning, isAlarmPlaying])

  // 손 위치 변화에 따른 타이머 제어 함수
  const handleTimerGesture = (handLandmarks) => {
    if (handLandmarks) {
      const palmY = handLandmarks[0].y // 손바닥의 Y 좌표를 가져옴

      // 손을 위로 올리면 타이머 시작
      if (palmY < 0.3 && !isTimerRunning) {
        setIsTimerRunning(true)
      }
      // 손을 아래로 내리면 타이머 일시 정지
      else if (palmY > 0.7 && isTimerRunning) {
        setIsTimerRunning(false)
      }
    }
  }

  const changePage = (direction) => {
    if (direction === "다음 페이지") {
      if (currentStep < pages.length - 1) {
        onNextStep()
      } else {
        setSwipeMessage("마지막 페이지 입니다")
      }
    } else if (direction === "이전 페이지") {
      if (currentStep > 0) {
        onPrevStep()
      } else {
        setSwipeMessage("첫 페이지 입니다")
      }
    }

    swipeTrackingRef.current.isTracking = false
    swipeTrackingRef.current.lastSwipeTimestamp = Date.now()
    swipeTrackingRef.current.lastPositions = []
    setTimeout(() => setSwipeMessage(""), 1000)
  }

  // 텍스트를 음성으로 읽어주는 함수
  const speakText = (text) => {
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(text)
    synth.speak(utterance)
  }

  const handleResponse = (data) => {
    const { intent, data: responseData } = data

    if (!intent) {
      const errorMessage = responseData.message
      console.log("에러 메시지:", errorMessage)
      speakText(errorMessage)
      return
    }

    switch (intent) {
      case "현재단계읽기":
        console.log(currentProcessRef.current.processExplain) // 최신 currentProcess 참조
        const currentText = `${currentProcessRef.current.processOrder}. ${currentProcessRef.current.processExplain}`
        console.log("읽을 텍스트:", currentText) // 콘솔에 출력
        speakText(currentText)
        break
      case "이전단계돌아가기":
        if (currentStep > 0) {
          onPrevStep()
          setSwipeMessage("이전 페이지")
        } else {
          setSwipeMessage("첫 페이지 입니다")
        }
        break
      case "다음단계넘어가기":
        if (currentStep < pages.length - 1) {
          onNextStep()
          setSwipeMessage("다음 페이지")
        } else {
          setSwipeMessage("마지막 페이지 입니다")
        }
        break
      case "종료하기":
        console.log("종료합니다.")
        onClose()
        break
      case "타이머중지":
        setIsTimerRunning(false)
        setTimer(0) // 타이머를 0으로 초기화
        stopAlarm() // 알람 소리 멈추기
        console.log("타이머 중지 및 초기화")
        break
      case "타이머설정":
        const { seconds, minutes } = responseData
        const totalSeconds = minutes * 60 + seconds
        setTimer(totalSeconds)
        setIsTimerRunning(true)
        console.log(`타이머 설정: ${minutes}분 ${seconds}초`)
        break
      case "대체재료추천1":
        const alternatives1 = responseData.alternativeIngredients.join(", ")
        const recommendation1 = `다음 재료를 추천합니다: ${alternatives1}`
        console.log(recommendation1)
        speakText(recommendation1)
        break
      case "대체재료추천2":
        const alternatives2 = responseData.alternativeIngredients.join(", ")
        const recommendation2 = `다음 재료를 추천합니다: ${alternatives2}. ${responseData.message}`
        console.log(recommendation2)
        speakText(recommendation2)
        break
      default:
        console.log("알 수 없는 intent:", intent)
    }

    // 최신 서버 응답을 상태로 업데이트
    setLastServerResponse(data)
  }

  // 터치 이벤트 처리 함수
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    swipeTrackingRef.current.startX = touch.clientX
    swipeTrackingRef.current.isTracking = true
  }

  const handleTouchMove = (e) => {
    if (!swipeTrackingRef.current.isTracking) return

    const touch = e.touches[0]
    const distance = touch.clientX - swipeTrackingRef.current.startX

    if (Math.abs(distance) > 50) {
      // 감지 거리 임계값
      const screenWidth = window.innerWidth
      const touchStartX = swipeTrackingRef.current.startX

      if (touchStartX > screenWidth / 2 && distance < 0) {
        if (currentStep < pages.length - 1) {
          setSwipeMessage("다음 페이지")
          changePage("다음 페이지")
        } else {
          setSwipeMessage("마지막 페이지 입니다")
        }
      } else if (touchStartX < screenWidth / 2 && distance > 0) {
        setSwipeMessage("이전 페이지")
        changePage("이전 페이지")
      }

      swipeTrackingRef.current.isTracking = false
      setTimeout(() => setSwipeMessage(""), 1000)
    }
  }

  const handleTouchEnd = () => {
    swipeTrackingRef.current.isTracking = false
  }

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7, // 신뢰도 상향
      minTrackingConfidence: 0.7,
    })

    holistic.onResults(onResults)

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await holistic.send({ image: videoRef.current })
        }
      },
      width: 640,
      height: 480,
    })
    if (videoRef.current) {
      camera.start()
    }

    function onResults(results) {
      if (!canvasRef.current) return
      const ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      const handLandmarks = results.leftHandLandmarks || results.rightHandLandmarks

      const currentTime = Date.now()

      if (!handLandmarks) {
        // 손이 인식되지 않으면 초기화
        swipeTrackingRef.current.isTracking = false
        swipeTrackingRef.current.lastPositions = []
        setHandDetected(false)
        return
      }

      setHandDetected(true)

      // 쿨다운 체크
      if (currentTime - swipeTrackingRef.current.lastSwipeTimestamp < swipeTrackingRef.current.cooldownPeriod) {
        return
      }

      const palmX = handLandmarks[9].x

      // 이동 평균 필터 적용
      swipeTrackingRef.current.lastPositions.push(palmX)
      if (swipeTrackingRef.current.lastPositions.length > 5) {
        swipeTrackingRef.current.lastPositions.shift() // 최근 5개의 데이터만 유지
      }
      const avgX = swipeTrackingRef.current.lastPositions.reduce((sum, x) => sum + x, 0) / swipeTrackingRef.current.lastPositions.length

      // 스와이프 시작 감지
      if (!swipeTrackingRef.current.isTracking) {
        swipeTrackingRef.current.startX = avgX
        swipeTrackingRef.current.isTracking = true
      } else {
        // 스와이프 방향 및 거리 계산
        const distance = avgX - swipeTrackingRef.current.startX

        if (Math.abs(distance) > 0.2) {
          const direction = distance > 0 ? "다음 페이지" : "이전 페이지"
          setSwipeMessage(direction)

          changePage(direction)
        }
      }

      // 타이머 제어 함수 호출
      handleTimerGesture(handLandmarks)
    }

    return () => {
      if (camera) {
        camera.stop()
      }
    }
  }, [isTimerRunning, isAlarmPlaying]) // 타이머 상태와 알람 재생 상태를 의존성 배열에 추가

  if (!pages || pages.length === 0) {
    return <div>No pages available</div>
  }

  if (!pages[currentStep]) {
    return (
      <div className="endding-comment" onClick={() => window.location.reload()}>
        레시피 화면으로
      </div>
    )
  }

  // 음성 인식 및 녹음 코드
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.continuous = true
    recognition.interimResults = false

    const callFooding = ["하이푸딩", "하이, 푸딩", "푸딩", "하이 푸딩.", "하이 푸딩", "하이퍼딩"]

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim()
          console.log("인식된 텍스트:", transcript) // 텍스트 콘솔 출력

          if (callFooding.some((phrase) => transcript.toLowerCase().includes(phrase.toLowerCase()))) {
            console.log("하이 푸딩 인식")
            setIsRecording(true) // 녹음 상태 변경
            setIsRecordingModalVisible(true) // 녹음 모달을 보이도록 설정
            startRecording()
          }

          if (transcript.toLowerCase().includes("알람 꺼")) {
            console.log("알람 꺼 인식")
            stopAlarm() // 알람 소리 멈추기
          }
        }
      }
    }

    recognition.start()

    let mediaRecorder
    let audioChunks = []

    const startRecording = () => {
      console.log("녹음 시작")
      audioChunks = [] // 새로운 녹음 파일 생성을 위해 초기화
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          setIsRecording(false) // 녹음 상태 변경
          setIsRecordingModalVisible(false) // 녹음 모달을 숨기도록 설정
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
          sendAudioToServer(audioBlob)
        }

        setTimeout(() => {
          mediaRecorder.stop()
        }, 5000) // 5초 녹음
      })
    }

    const sendAudioToServer = (audioBlob) => {
      const formData = new FormData()
      formData.append("file", audioBlob, "음성.wav") // 파일 이름을 지정하여 업로드
      formData.append("recipeId", recipeId) // 현재 레시피 아이디 전송

      fetch("https://i12e107.p.ssafy.io/api/speech/process", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("서버 응답 데이터:", data) // 서버 응답 데이터 콘솔 출력
          handleResponse(data) // 서버 응답 데이터 처리
        })
        .catch((error) => {
          console.error("오류:", error)
        })
    }

    return () => {
      recognition.stop()
    }
  }, []) // 빈 의존성 배열로 첫 렌더링 시에만 실행

  return (
    <div className="handpose-container3" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <video ref={videoRef} style={{ display: "none" }} autoPlay playsInline />
      <canvas ref={canvasRef} className="handpose-canvas" />
      <div className="card-div7">
        <div className="steps3">
          <div className="process-item3">
            <h2 className="steps-h23">
              {currentProcessRef.current.processOrder}. {currentProcessRef.current.processExplain}
            </h2>
          </div>
          <div className="process-image-container3">
            {currentProcessRef.current.images &&
              currentProcessRef.current.images.map((image, imgIndex) => (
                <img key={imgIndex} src={image.imageUrl} alt={`Process ${currentProcessRef.current.processOrder}`} className="process-image3" />
              ))}
          </div>
          <hr />
        </div>
      </div>
      {swipeMessage && <div className="swipe-message">{swipeMessage}</div>}
      <div className="timer3">
        <img className="timer-image3" src="/images/timerequired.png" alt="Time Required" />
        {Math.floor(timer / 60)}분 {timer % 60}초
      </div>
      {currentStep === pages.length - 1 && <div className="end-message">마지막 페이지 입니다</div>}

      {isRecordingModalVisible && (
        <div className="recording-modal">
          <img className="recording-gif" src="/images/record.gif" alt="Recording..." />
        </div>
      )}
    </div>
  )
}

HandPoseComponent.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  pages: PropTypes.arrayOf(PropTypes.object).isRequired,
  recipeId: PropTypes.string.isRequired, // recipeId prop 유형 추가
}

export default HandPoseComponent
