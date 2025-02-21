package com.ssafy.foodthink.user.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class UserInfoDto {

    private Long userId;
    private String email;
    private String nickname;
    private String image;
    private String season;
}
