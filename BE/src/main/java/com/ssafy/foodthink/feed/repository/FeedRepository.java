package com.ssafy.foodthink.feed.repository;

import com.ssafy.foodthink.feed.entity.FeedEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FeedRepository extends JpaRepository<FeedEntity, Long> {
    List<FeedEntity> findAllByUserEntity_userIdOrderByWriteTime(Long id);
    @Query("SELECT f FROM FeedEntity f ORDER BY f.writeTime DESC")
    Page<FeedEntity> findAllOrderByWriteTime(Pageable pageable);

    //좋아요순 상위 6개의 특정 레시피 아이디를 가진 피드 조회
    @Query("SELECT f FROM FeedEntity f WHERE f.recipeEntity.recipeId = :recipeId " +
            "ORDER BY SIZE(f.likes) DESC")
    List<FeedEntity> findTop6ByRecipeEntity_RecipeIdOrderByLikesDesc(@Param("recipeId") Long recipeId, Pageable pageable);

    Page<FeedEntity> findByIdIn(List<Long> ids, Pageable pageable);
}

