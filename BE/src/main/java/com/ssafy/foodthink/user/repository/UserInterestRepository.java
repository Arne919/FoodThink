package com.ssafy.foodthink.user.repository;

import com.ssafy.foodthink.user.entity.UserEntity;
import com.ssafy.foodthink.user.entity.UserInterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterestEntity, Long> {
    List<UserInterestEntity> findByUserId(UserEntity userId); // userid로 회원의 관심사 찾기

    void deleteByUserId(UserEntity user); // 사용자의 관심사 모두 삭제
}

