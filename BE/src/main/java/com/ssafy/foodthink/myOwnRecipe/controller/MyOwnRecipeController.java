package com.ssafy.foodthink.myOwnRecipe.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.myOwnRecipe.dto.*;
import com.ssafy.foodthink.myOwnRecipe.service.MyOwnRecipeService;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/myOwnRecipe")
@RequiredArgsConstructor
@Slf4j
public class MyOwnRecipeController {

    private final MyOwnRecipeService myOwnRecipeService;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    private final RecipeRepository recipeRepository;
    private final S3Service s3Service;

    //레시피 저장
    @PostMapping("/create")
    public ResponseEntity<?> createRecipe(@RequestHeader("Authorization") String token,
                                          @RequestPart("recipe") String recipeJson,
                                          @RequestPart("imageFile") MultipartFile imageFile,
                                          @RequestPart(value = "processImages", required = false) List<MultipartFile> processImages,
                                          @RequestPart(value = "processOrders", required = false) List<Integer> processOrders) {
        try {
            // JSON을 DTO로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            MyRecipeWriteRequestDto dto = objectMapper.readValue(recipeJson, MyRecipeWriteRequestDto.class);

            // JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);
            dto.setUserId(userId);

            // processImages와 processOrders 매핑하기
            if (processImages != null && processOrders != null) {
                if (processImages.size() != processOrders.size()) {
                    throw new IllegalArgumentException("이미지와 과정 순서의 갯수가 일치하지 않습니다.");
                }

                Map<Integer, ProcessImageRequestDto> imageMap = new HashMap<>();
                for(int i=0; i<processOrders.size(); i++) {
                    Integer order = processOrders.get(i);
                    MultipartFile image = processImages.get(i);
                    imageMap.put(order, new ProcessImageRequestDto(order, image));
                }

                for(ProcessRequestDto processDto : dto.getProcesses()) {
                    ProcessImageRequestDto imageDto = imageMap.get(processDto.getProcessOrder());
                    if(imageDto != null) {
                        if(processDto.getImages() == null) processDto.setImages(new ArrayList<>());
                        processDto.getImages().add(imageDto);
                    }
                }
            }

            // 서비스 호출 -> 레시피 아이디 반환
            Long recipeId = myOwnRecipeService.createRecipe(dto, imageFile);

            return ResponseEntity.ok(recipeId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("레시피 저장에 실패했습니다.");
        }
    }

    //수정할 레시피 정보 조회 (미리보기)
    @GetMapping("/read/modifyRecipe/{recipeId}")
    public ResponseEntity<?> getRecipeForModification(@RequestHeader("Authorization") String token,
                                                      @PathVariable("recipeId") Long recipeId) {
        try {
            //JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);   //로그인한 사용자 정보 추출

            //수정할 레시피 조회
            MyRecipeModifyReadResponseDto recipe = myOwnRecipeService.getRecipeForModification(recipeId, userId);

            return ResponseEntity.ok(recipe);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정할 레시피 정보 조회에 실패했습니다.");
        }
    }

    //레시피 수정
    @PutMapping("/update/{recipeId}")
    public ResponseEntity<?> modifyRecipe(@RequestHeader("Authorization") String token,
                                          @PathVariable("recipeId") Long recipeId,
                                          @RequestPart("recipe") String recipeJson,
                                          @RequestPart("imageFile") MultipartFile imageFile,
                                          @RequestPart(value="processImages", required = false) List<MultipartFile> processImages,
                                          @RequestPart(value="processOrders", required = false) List<Integer> processOrders) throws JsonProcessingException {

        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        myOwnRecipeService.modifyRecipe(userId, recipeId, recipeJson, imageFile, processImages, processOrders);
        return ResponseEntity.ok("레시피 수정 완료");

//        try {
//            myOwnRecipeService.modifyRecipe(token, recipeId, recipeJson, imageFile, processImages, processOrders);
//            return ResponseEntity.ok("레시피 수정 완료");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("레시피 수정 오류 발생 : " + e.getMessage());
//        }

    }


//    public ResponseEntity<?> modifyRecipe(@RequestHeader("Authorization") String token,
//                                          @RequestPart("recipe") String recipeJson,
//                                          @RequestPart("imageFile") MultipartFile imageFile,
//                                          @RequestPart(value="processImages", required = false) List<MultipartFile> processImages,
//                                          @RequestPart(value="processOrders", required = false) List<Integer> processOrders) {
//        try {
//            // JSON을 DTO로 변환
//            ObjectMapper objectMapper = new ObjectMapper();
//            MyRecipeModifyRequestDto dto = objectMapper.readValue(recipeJson, MyRecipeModifyRequestDto.class);
//
//            // JWT에서 userId 호출
//            String accessToken = token.replace("Bearer ", "");
//            Long userId = jwtUtil.getUserId(accessToken);
//            dto.setUserId(userId);
//
//            // processImages와 processOrders 매핑하기
//            if (processImages != null && processOrders != null) {
//                if (processImages.size() != processOrders.size()) {
//                    throw new IllegalArgumentException("이미지와 과정 순서의 갯수가 일치하지 않습니다.");
//                }
//
//                Map<Integer, ProcessImageRequestDto> imageMap = new HashMap<>();
//                for(int i=0; i<processOrders.size(); i++) {
//                    Integer order = processOrders.get(i);
//                    MultipartFile image = processImages.get(i);
//                    imageMap.put(order, new ProcessImageRequestDto(order, image));
//                }
//
//                for(ProcessRequestDto processDto : dto.getProcesses()) {
//                    ProcessImageRequestDto imageDto = imageMap.get(processDto.getProcessOrder());
//                    if(imageDto != null) {
//                        if(processDto.getImages() == null) processDto.setImages(new ArrayList<>());
//                        processDto.getImages().add(imageDto);
//                    }
//                }
//            }
//
//            // 서비스 호출
//            myOwnRecipeService.modifyRecipe(dto, imageFile);
//
//            return ResponseEntity.ok("레시피가 수정되었습니다.");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("레시피 수정에 실패했습니다.");
//        }
//    }





    //내가 작성한 레시피 목록 조회 (북마크순하고 조회순)
    @GetMapping("/read/myRecipeList")
    public List<MyOwnRecipeListResponseDto> getMyOwnRecipeList(@RequestHeader("Authorization") String token) {
        // JWT에서 userId 호출
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return myOwnRecipeService.getMyOwnRecipeList(userEntity);
    }


    //레시피 삭제
    // 레시피 삭제
    @DeleteMapping("/delete/{recipeId}")
    public ResponseEntity<?> deleteRecipe(@RequestHeader("Authorization") String token,
                                          @PathVariable("recipeId") Long recipeId) {
        try {
            // JWT에서 userId 호출
            String accessToken = token.replace("Bearer ", "");
            Long userId = jwtUtil.getUserId(accessToken);

            // 레시피가 사용자가 작성한 것인지 확인
            RecipeEntity recipeEntity = myOwnRecipeService.getRecipeByIdAndUserId(recipeId, userId);
            if (recipeEntity == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("해당 레시피는 삭제할 수 없습니다.");
            }

            // 레시피 삭제
            myOwnRecipeService.deleteRecipe(recipeId);

            return ResponseEntity.ok("레시피가 삭제되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("레시피 삭제에 실패했습니다.");
        }
    }


    //다른 사용자가 작성한 래시피 목록 조회
    //다른 사용자의 마이페이지
    @GetMapping("/read/diffUserRecipeList/{nickName}")
    public ResponseEntity<List<MyOwnRecipeListResponseDto>> getDiffUserRecipeList(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable("nickName") String nickName) {

        Long userId = null;

        if(token != null && token.startsWith("Bearer ")) {
            try {
                String accessToken = token.replace("Bearer ", "");
                userId = jwtUtil.getUserId(accessToken);
            } catch (Exception e) {
                userId = null;
            }
        }

        List<MyOwnRecipeListResponseDto> recipeList = myOwnRecipeService.getRecipesByNickname(nickName);

        return ResponseEntity.ok(recipeList);

    }




}
