package com.ssafy.foodthink.myOwnRecipe.service;

import com.ssafy.foodthink.global.S3Service;
import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeModifyReadResponseDto;
import com.ssafy.foodthink.myOwnRecipe.dto.MyRecipeWriteRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessImageRequestDto;
import com.ssafy.foodthink.myOwnRecipe.dto.ProcessRequestDto;
import com.ssafy.foodthink.recipes.dto.IngredientDto;
import com.ssafy.foodthink.recipes.dto.ProcessDto;
import com.ssafy.foodthink.recipes.dto.ProcessImageDto;
import com.ssafy.foodthink.recipes.entity.IngredientEntity;
import com.ssafy.foodthink.recipes.entity.ProcessEntity;
import com.ssafy.foodthink.recipes.entity.ProcessImageEntity;
import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import com.ssafy.foodthink.recipes.repository.IngredientRepository;
import com.ssafy.foodthink.recipes.repository.ProcessImageRepository;
import com.ssafy.foodthink.recipes.repository.ProcessRepository;
import com.ssafy.foodthink.recipes.repository.RecipeRepository;
import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyOwnRecipeService {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;
    private final ProcessRepository processRepository;
    private final ProcessImageRepository processImageRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    //레시피 등록
    @Transactional
    public void createRecipe(MyRecipeWriteRequestDto dto, MultipartFile imageFile) {

        log.info(dto.toString()); // 레시피 저장 요청

        // 사용자 인증 : JWT
        UserEntity user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));

        // 대표 이미지 업로드
        String recipeImageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            recipeImageUrl = s3Service.uploadFile(imageFile);
        }

        try {
            // 레시피 엔티티 생성 및 저장
            RecipeEntity recipeEntity = new RecipeEntity();
            recipeEntity.setUserEntity(user);
            recipeEntity.setRecipeTitle(dto.getRecipeTitle());
            recipeEntity.setCateType(dto.getCateType());
            recipeEntity.setCateMainIngre(dto.getCateMainIngre());
            recipeEntity.setServing(dto.getServing());
            recipeEntity.setLevel(dto.getLevel());
            recipeEntity.setRequiredTime(dto.getRequiredTime());
            recipeEntity.setIsPublic(dto.isPublic());
            recipeEntity.setImage(recipeImageUrl);

            recipeRepository.save(recipeEntity);

            // 재료 저장
            List<IngredientEntity> ingredientEntities = dto.getIngredients().stream()
                    .map(ingreDto -> {
                        IngredientEntity ingredient = new IngredientEntity();
                        ingredient.setIngreName(ingreDto.getIngreName());
                        ingredient.setAmount(ingreDto.getAmount());
                        ingredient.setRecipeEntity(recipeEntity);
                        return ingredient;
                    }).collect(Collectors.toList());

            ingredientRepository.saveAll(ingredientEntities);

            // 과정 저장
            List<ProcessEntity> processEntities = dto.getProcesses().stream()
                    .map(processDto -> {
                        ProcessEntity process = new ProcessEntity();
                        process.setProcessOrder(processDto.getProcessOrder());
                        process.setProcessExplain(processDto.getProcessExplain());
                        process.setRecipeEntity(recipeEntity);
                        return process;
                    }).collect(Collectors.toList());
            processRepository.saveAll(processEntities);

            // 강제 flush() 호출 (process_id 확보)
            processRepository.flush();

            // 과정 이미지 저장 (과정 ID 매칭)
            for (ProcessRequestDto processDto : dto.getProcesses()) {
                ProcessEntity processEntity = processEntities.stream()
                        .filter(p -> p.getProcessOrder().equals(processDto.getProcessOrder()))
                        .findFirst()
                        .orElseThrow(() -> new IllegalArgumentException("과정 매칭 실패"));

                if (processDto.getImages() != null) {
                    for (ProcessImageRequestDto imageRequestDto : processDto.getImages()) {
                        if (imageRequestDto.getProcessImage() != null && !imageRequestDto.getProcessImage().isEmpty()) {
                            String uploadedImageUrl = s3Service.uploadFile(imageRequestDto.getProcessImage());
                            ProcessImageEntity processImage = new ProcessImageEntity();
                            processImage.setImageUrl(uploadedImageUrl);
                            processImage.setProcessEntity(processEntity);
                            processImageRepository.save(processImage);
                        }
                    }
                }
            }

            log.info("레시피 저장 완료");
        } catch (Exception e) {
            if (recipeImageUrl != null) {
                s3Service.deleteFileFromS3(recipeImageUrl);     // 실패 시, S3에 업로드된 이미지 삭제
            }
            throw new RuntimeException("레시피 저장 중 오류 발생", e);
        }
    }

    //수정할 레시피 내용 조회 (미리보기)
    public MyRecipeModifyReadResponseDto getRecipeForModification(Long recipeId, Long userId) {
        //레시피가 존재하는지 확인
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new IllegalArgumentException("레시피를 찾을 수 없습니다."));

        //요청한 사용자가 작성한 레시피인지 확인
        if(!recipe.getUserEntity().getUserId().equals(userId)) {
            throw new IllegalArgumentException("수정 권한이 없습니다.");
        }

        //레시피 정보 DTO 변환
        MyRecipeModifyReadResponseDto responseDto = new MyRecipeModifyReadResponseDto();
        responseDto.setRecipeId(recipe.getRecipeId());
        responseDto.setRecipeTitle(recipe.getRecipeTitle());
        responseDto.setImage(recipe.getImage());
        responseDto.setCateType(recipe.getCateType());
        responseDto.setCateMainIngre(recipe.getCateMainIngre());
        responseDto.setServing(recipe.getServing());
        responseDto.setLevel(recipe.getLevel());
        responseDto.setRequiredTime(recipe.getRequiredTime());
        responseDto.setPublic(recipe.getIsPublic());

        // 재료 정보 조회
        List<IngredientDto> ingredients = ingredientRepository.findByRecipeEntity_RecipeId(recipeId).stream()
                .map(ingredient -> new IngredientDto(ingredient.getIngreName(), ingredient.getAmount()))
                .collect(Collectors.toList());
        responseDto.setIngredients(ingredients);

        // 과정 정보 조회
        List<ProcessDto> processes = processRepository.findByRecipeEntity_RecipeId(recipeId).stream()
                .map(process -> {
                    List<ProcessImageDto> processImages = process.getProcessImages().stream()
                            .map(image -> new ProcessImageDto(image.getImageUrl()))
                            .collect(Collectors.toList());
                    return new ProcessDto(process.getProcessOrder(), process.getProcessExplain(), processImages);
                })
                .collect(Collectors.toList());
        responseDto.setProcesses(processes);

        return responseDto;
    }


}
