package com.example.demo2.word;

import jakarta.persistence.*;

@Entity
@Table(name = "word")
public class Word {
    @Id
    @Column(name = "german",  unique = true, nullable = false)
    private String german;
    private String english;
    private String part_of_speech;
    private String gender;
    private Integer rating;

    public Word() {
    }

    public Word(String english, String german, String part_of_speech, Integer rating) {
        this.english = english;
        this.german = german;
        this.part_of_speech = part_of_speech;
        this.rating = rating;
    }

    public Word(String english, String german, String part_of_speech, Integer rating, String gender) {
        this.english = english;
        this.german = german;
        this.part_of_speech = part_of_speech;
        this.rating = rating;
        this.gender = gender;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
