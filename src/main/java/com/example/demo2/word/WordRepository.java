package com.example.demo2.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WordRepository extends JpaRepository<Word,String> {
    void deleteWordByEnglish(String english);
    Optional<Word> findWordByEnglish(String english);
}
