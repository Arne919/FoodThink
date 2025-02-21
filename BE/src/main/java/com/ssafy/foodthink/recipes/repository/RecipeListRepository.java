package com.ssafy.foodthink.recipes.repository;

import com.ssafy.foodthink.recipes.entity.RecipeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeListRepository extends JpaRepository<RecipeEntity, Long> {

    /*
        레시피 목록 조회
        catType, catMainIngre, sortType 파라미터를 받아서 그에 따라 정렬한다.
     */
    @Query("SELECT r FROM RecipeEntity r " +
            "LEFT JOIN r.userEntity u " +
            "LEFT JOIN RecipeBookmarkEntity b ON r.recipeId = b.recipeEntity.recipeId " +
            "WHERE (:cateType IS NULL OR r.cateType = :cateType) " +
            "AND (:cateMainIngre IS NULL OR r.cateMainIngre = :cateMainIngre) " +
            "AND r.isPublic = true " +
            "GROUP BY r " +
            "ORDER BY " +
            "CASE WHEN :sortType = '조회순' THEN r.hits END DESC, " +
            "CASE WHEN :sortType = '최신순' THEN r.writeTime END DESC, " +
            "CASE WHEN :sortType = '북마크순' THEN COUNT(b) END DESC")
    Page<RecipeEntity> findRecipesByFilter(
            @Param("cateType") String cateType,
            @Param("cateMainIngre") String cateMainIngre,
            @Param("sortType") String sortType,
            Pageable pageable
    );


    //캐러셀용 : 레시피 목록 20개를 조회순으로
    @Query("SELECT r FROM RecipeEntity r WHERE r.isPublic = true ORDER BY r.hits DESC")
    List<RecipeEntity> findTopRecipesByHits(Pageable pageable);

    @Modifying
    @Query("UPDATE RecipeEntity r SET r.hits = r.hits + 1 WHERE r.recipeId = :recipeId")
    void increaseHits(@Param("recipeId") Long recipeId);

}
