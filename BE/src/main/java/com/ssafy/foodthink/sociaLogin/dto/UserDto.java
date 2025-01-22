package com.ssafy.foodthink.sociaLogin.dto;

import com.ssafy.foodthink.sociaLogin.entity.UserEntity;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
//@Builder
@Setter
public class UserDto {

    private String role;
    private String email;
    private String nickname;
    private String socialId;
    private String socialType;

}
