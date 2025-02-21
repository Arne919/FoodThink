package com.ssafy.foodthink.feed.dto;

import com.ssafy.foodthink.recipes.dto.RecipeListResponseDto;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FeedResponseDto {
    private Long id;
    private String foodName;
    private String content;
    private LocalDateTime writeTime;
    private Long userId;
    private String username;
    private String userImage;
    private RecipeListResponseDto recipeListResponseDto;
    private Long recipeId;
    private List<String> images;
    private boolean isLike;
    private List<FeedCommentResponseDto> feedCommentResponseDtos;
}
