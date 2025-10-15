package com.example.demo2.word;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "api/v1/word")
public class WordController {
    private final WordService wordService;


    @Autowired
    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public List<Word> getAllWords(
            @RequestParam(required = false) String english,
            @RequestParam(required = false) String german)
    {
        if(english != null) return wordService.getWordByEnglish(english);
        else if(german != null) return  wordService.getWordByGerman(german);
        else return wordService.getWords();
    }
    @PostMapping
    public ResponseEntity<Word> addWord(@RequestBody Word word) {
        Word createdWord = wordService.addWord(word);
        return new ResponseEntity<>(createdWord, HttpStatus.CREATED);
    }
    @PutMapping
    public ResponseEntity<Word> updateWord(@RequestBody Word word) {
        Word updateWord = wordService.updateRating(word);
        if(updateWord != null) {
            return new ResponseEntity<>(updateWord, HttpStatus.OK);
        }
        else  {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping
    public ResponseEntity<Word> deleteWord(@RequestBody Word word) {
        wordService.deleteWord(word);
        return new ResponseEntity<>(word, HttpStatus.OK);
    }
}
