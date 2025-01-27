package com.ssafy.foodthink.recipes.service;

import com.ssafy.foodthink.recipes.dto.AllRecipeListDto;
import com.ssafy.foodthink.recipes.entity.UserRecipeEntity;
import com.ssafy.foodthink.recipes.repository.CrawlingRecipesRepository;
import com.ssafy.foodthink.recipes.repository.UserRecipesRepository;
import com.ssafy.foodthink.webCrawling.entity.CrawlingRecipeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final UserRecipesRepository userRecipesRepository;
    private final CrawlingRecipesRepository crawlingRecipesRepository;

    //모든 레시피 조회 : 나만의레시피 + 크롤링레시피
    public Page<AllRecipeListDto> findAllRecipes(String sortType, Pageable pageable) {
        //각 테이블에서 데이터 조회
        Page<UserRecipeEntity> userRecipes = fetchUserRecipes(sortType, pageable);
        Page<CrawlingRecipeEntity> crawlingRecipes = fetchCrawlingRecipes(sortType, pageable);

        //DTO 변환
        List<AllRecipeListDto> combinedDto = Stream.concat(
                userRecipes.getContent().stream().map(this::convertUserRecipesListToDto),
                crawlingRecipes.getContent().stream().map(this::convertCrawlingRecipesListToDto)
        ).collect(Collectors.toList());

        //페이지네이션 처리
        return new PageImpl<>(combinedDto, pageable,
                userRecipes.getTotalElements() + crawlingRecipes.getTotalElements());
    }

    //나만의레시피 정렬에 따른 조회
    private Page<UserRecipeEntity> fetchUserRecipes(String sortType, Pageable pageable) {
        return switch (sortType) {
            case "latest" -> userRecipesRepository.findPublicRecipesByWriteTime(pageable);
            case "hits" -> userRecipesRepository.findPublicRecipesByHits(pageable);
            case "level" -> userRecipesRepository.findPublicRecipesByLevel(pageable);
            default -> Page.empty(pageable);
        };
    }

    //크롤링레시피 정렬에 따른 조회
    private Page<CrawlingRecipeEntity> fetchCrawlingRecipes(String sortType, Pageable pageable) {
        return switch (sortType) {
            case "latest" -> crawlingRecipesRepository.findCrawlingRecipesByWriteTime(pageable);
            case "hits" -> crawlingRecipesRepository.findCrawlingRecipesByHits(pageable);
            case "level" -> crawlingRecipesRepository.findCrawlingRecipesByLevel(pageable);
            default -> Page.empty(pageable);
        };
    }

    //entity -> dto
    private AllRecipeListDto convertUserRecipesListToDto(UserRecipeEntity entity) {
        return new AllRecipeListDto(entity.getRecipeId(), entity.getRecipeTitle(),
                entity.getHits(), entity.getRecipeUrl(), entity.getImage());
    }

    //entity -> dto
    private AllRecipeListDto convertCrawlingRecipesListToDto(CrawlingRecipeEntity entity) {
        return new AllRecipeListDto(entity.getRecipeId(), entity.getRecipeTitle(),
                entity.getHits(), entity.getRecipeUrl(), entity.getImage());
    }

}
