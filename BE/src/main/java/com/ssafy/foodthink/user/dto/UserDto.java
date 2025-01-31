package com.ssafy.foodthink.user.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class UserDto {

    private String role;
    private String email;
    private String nickname;
    private String socialId;
    private String socialType;
    private String image;

}
