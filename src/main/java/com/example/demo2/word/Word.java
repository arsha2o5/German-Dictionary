package com.example.demo2.word;

import jakarta.persistence.*;

@Entity
@Table(name = "word")
public class Word {
    @Id
    @Column(name = "english",  unique = true, nullable = false)
    private String english;
    private String german;
    private String part_of_speech;
    private Integer rating;

    public Word() {
    }

    public Word(String english, String german, String part_of_speech, Integer rating) {
        this.english = english;
        this.german = german;
        this.part_of_speech = part_of_speech;
        this.rating = rating;
    }

    public String getEnglish() {
        return english;
    }

    public void setEnglish(String english) {
        this.english = english;
    }

    public String getGerman() {
        return german;
    }

    public void setGerman(String german) {
        this.german = german;
    }

    public String getPart_of_speech() {
        return part_of_speech;
    }

    public void setPart_of_speech(String part_of_speech) {
        this.part_of_speech = part_of_speech;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
