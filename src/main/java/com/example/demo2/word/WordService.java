package com.example.demo2.word;


import jakarta.transaction.Transactional;
import org.hibernate.internal.build.AllowNonPortable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class WordService {
    private final WordRepository wordRepository;

    @Autowired
    public WordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }
    public List<Word> getWordByEnglish(String english) {
        return wordRepository.findAll().stream()
                .filter(word -> word.getEnglish().toLowerCase()
                        .contains(english.toLowerCase())).collect(Collectors.toList());
    }
    public List<Word> getWordByGerman(String german) {
        return wordRepository.findAll().stream()
                .filter(word -> word.getGerman().toLowerCase()
                        .contains(german.toLowerCase())).collect(Collectors.toList());
    }
    public List<Word> getWords() {
        return wordRepository.findAll();
    }
    public Word addWord(Word word) {
        wordRepository.save(word);
        return word;
    }
    public Word updateRating(Word word) {
        Optional<Word> existingWord = wordRepository.findWordByEnglish(word.getEnglish());
        if(existingWord.isPresent()) {
            Word wordToUpdate = existingWord.get();
            wordToUpdate.setRating(word.getRating());
            wordRepository.save(wordToUpdate);
            return wordToUpdate;
        }
        return null;
    }
    @Transactional
    public void deleteWord(Word word) {
        wordRepository.delete(word);
    }
}
