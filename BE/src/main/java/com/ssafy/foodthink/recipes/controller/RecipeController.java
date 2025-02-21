package com.ssafy.foodthink.recipes.controller;

import com.ssafy.foodthink.recipes.dto.*;
import com.ssafy.foodthink.recipes.service.RecipeService;
import com.ssafy.foodthink.user.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final JWTUtil jwtUtil;

    //레시피 목록 조회 : 카테고리별 + 정렬
    @GetMapping("read/recipeList")
    public RecipeListPageResponseDto searchRecipeList(
            @RequestParam(value = "cateType", required = false) String cateType,
            @RequestParam(value = "cateMainIngre", required = false) String cateMainIngre,
            @RequestParam(value = "sortType", required = false, defaultValue = "조회순") String sortType,
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size) {

        RecipeListRequestDto requestDto = new RecipeListRequestDto(cateType, cateMainIngre, sortType, page, size);
        return recipeService.searchRecipeList(requestDto);
    }

    //레시피 조회순 상위 20 목록 조회
    @GetMapping("read/recipeList/top20/hits")
    public List<RecipeListTop20ResponseDto> getTop20RecipesByHits() {
        return recipeService.getTop20RecipesByHits();
    }

    //레시피 추천순 목록 조회 (로그인 했을 때 사용자가 구독한 사용자의 레시피들)

    //레시피 상세 보기
    @GetMapping("read/detail/{recipeId}")
    public RecipeDetailResponseDto getRecipeDetail(@PathVariable Long recipeId, @RequestHeader(value = "Authorization", required = false) String token) {

        // 로그인 안했을경우
        if(token == null || token.isEmpty()){
            return recipeService.getRecipeDetail(recipeId);
        }

        //로그인 했을 경우
        String accessToken = token.replace("Bearer ", "");
        Long userId = jwtUtil.getUserId(accessToken);

        return recipeService.getRecipeDetail(recipeId,userId);
    }

    //레시피 보기 : 요리 과정 중 재료 정보 (첫페이지)
    //재료 정보
    @GetMapping("read/ingredients/{recipeId}")
    public List<IngredientDto> getIngredients(@PathVariable Long recipeId) {
        return recipeService.getIngredients(recipeId);
    }

    //레시피 보기 : 요리 과정 중 페이지별로 과정 보기
    //과정 정보 + 페이지 정보
    @GetMapping("read/processes/{recipeId}/{page}")
    public ProcessPageResponseDto getProcessPage(@PathVariable Long recipeId, @PathVariable int page) {
        return recipeService.getProcessPage(recipeId, page);
    }

}
