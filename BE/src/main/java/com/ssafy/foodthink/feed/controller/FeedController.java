package com.ssafy.foodthink.feed.controller;

import com.ssafy.foodthink.feed.dto.*;
import com.ssafy.foodthink.feed.service.FeedService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Controller
@RestController
@RequestMapping("/api/feed")
//@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;
    private final JWTUtil jwtUtil;

    public FeedController(FeedService feedService, JWTUtil jwtUtil) {
        this.feedService = feedService;
        this.jwtUtil = jwtUtil;
    }

    //피드 저장
    @PostMapping("/create")
    public ResponseEntity<?> createFeed(@RequestHeader("Authorization") String token,
                                        @RequestPart FeedRequestDto feedRequestDto,
                                        @RequestPart("images") List<MultipartFile> images){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedRequestDto.setUserId(userId);
        feedService.createFeed(feedRequestDto, images);
        return ResponseEntity.ok("피드 성공적으로 저장되었습니다.");
    }

    //피드 id로 조회
    @GetMapping("/read/id/{id}")
    public ResponseEntity<?> readFeedById(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token){
        if(token == null || token.isEmpty()){
            return ResponseEntity.ok(feedService.readFeedById(id));
        }

        //로그인 했을 경우
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        return ResponseEntity.ok(feedService.readFeedById(id, userId));
    }

    //마이페이지 로그인한 사용자 피드 조회
    @GetMapping("/read/login")
    public ResponseEntity<?> readFeedByLoginedId(@RequestHeader(value = "Authorization", required = false) String token){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        return ResponseEntity.ok(feedService.readSummaryFeedsOrderByWriteTime(userId));
    }

    //피드 유저별 조회(최신순)
    @GetMapping("/read/user/{id}")
    public ResponseEntity<?> readFeedsByUserId(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token){
        if(token == null || token.isEmpty()){
            return ResponseEntity.ok(feedService.readFeedsByUserId(id));
        }

        //로그인 했을 경우
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        return ResponseEntity.ok(feedService.readFeedsByUserId(id, userId));
    }

    @DeleteMapping("/delete/{feedId}")
    public ResponseEntity<?> deleteFeedByFeedId(@PathVariable Long feedId, @RequestHeader("Authorization") String token){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        feedService.deleteFeed(feedId, userId);

        //삭제 응답(204)
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update/{feedId}")
    public ResponseEntity<?> updateFeedByFeedId(@RequestHeader("Authorization") String token,
                                                @PathVariable Long feedId,
                                                @RequestPart FeedRequestDto feedRequestDto,
                                                @RequestPart("images") List<MultipartFile> images){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        feedService.updateFeed(feedId, userId, feedRequestDto, images);

        return ResponseEntity.ok("피드가 정상적으로 수정되었습니다.");
    }

    //피드 좋아요 추가 기능
    @PostMapping("/like/create/{feedId}")
    public ResponseEntity<?> createFeedLikeByFeedId(@PathVariable Long feedId, @RequestHeader(value = "Authorization") String token){
        if (token == null || !token.startsWith("Bearer ")) {
            throw new AccessDeniedException("토큰이 없습니다.");
        }

        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedService.createFeedLikeByFeedId(feedId, userId);
        return ResponseEntity.ok("피드 좋아요가 성공적으로 저장되었습니다.");
    }

    //피드 좋아요 삭제 기능
    @DeleteMapping("/like/delete/{feedId}")
    public ResponseEntity<Void> deleteFeedLike(@PathVariable Long feedId ,@RequestHeader("Authorization") String token){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedService.deleteFeedLikeByFeedId(feedId, userId);
        return ResponseEntity.noContent().build();  //성공시 204 응답(요청 성공나타내지만, 추가 정보가 필요하지 않을때 사용)
    }

    //피드 댓글 추가 기능
    @PostMapping("/comment/create/{feedId}")
    public ResponseEntity<?> createFeedComment(@PathVariable Long feedId,
                                               @RequestHeader("Authorization") String token,
                                               @RequestBody FeedCommentRequestDto feedCommentRequestDto){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedCommentRequestDto.setUserId(userId);
        feedService.createFeedCommentByFeedId(feedId, feedCommentRequestDto);
        return ResponseEntity.ok("피드 댓글이 성공적으로 저장되었습니다.");
    }

    //피드 댓글 삭제 기능
    @DeleteMapping("/comment/delete/{feedCommentId}")
    public ResponseEntity<Void> deleteFeedCommentByFeedCommentId(@PathVariable Long feedCommentId, @RequestHeader("Authorization") String token){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedService.deleteFeedCommentByFeedCommentId(feedCommentId);
        return ResponseEntity.noContent().build();
    }

    //피드 댓글 수정 기능
    @PutMapping("/comment/update/{feedCommentId}")
    public ResponseEntity<?> updateFeedComment(@PathVariable Long feedCommentId,
                                               @RequestHeader("Authorization") String token,
                                               @RequestBody FeedCommentRequestDto feedCommentRequestDto){
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);
        feedCommentRequestDto.setUserId(userId);
        feedService.updateFeedCommentByFeedCommentId(feedCommentId, feedCommentRequestDto);
        return ResponseEntity.ok("피드 댓글이 성공적으로 수정되었습니다.");
    }

    //피드별 댓글 조회 기능
    @GetMapping("/comment/read/{feedId}")
    public ResponseEntity<?> readFeedCommentsByFeedId(@PathVariable Long feedId){
        return ResponseEntity.ok(feedService.readFeedCommentsByFeedId(feedId));
    }

    //피드 최신순 조회(페이지네이션)
    @GetMapping("/read/latest")
    public ResponseEntity<?> readFeedsOrderByWriteTime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size){
        return ResponseEntity.ok(feedService.readFeedsOrderByWriteTime(page, size));
    }

//    특정 레시피를 참고한 피드들 조회 (레시피 상세 보기 페이지)
    @GetMapping("/read/inRecipe/{recipeId}")
    public ResponseEntity<?> getFeedByRecipe(@PathVariable Long recipeId) {
        List<FeedSummaryResponseDto> responseDtoList = feedService.getTop6FeedsByRecipeId(recipeId);
        return ResponseEntity.ok(responseDtoList);
    }



}
