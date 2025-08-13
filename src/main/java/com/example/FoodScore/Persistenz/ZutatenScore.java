package com.example.FoodScore.Persistenz;

import jakarta.persistence.*;

@Entity
@Table(name = "zutaten_score")
public class ZutatenScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zutat_name", unique = true, nullable = false)
    private String zutatName;

    @Column(name = "score", nullable = false)
    private Integer score;

    // Konstruktoren
    public ZutatenScore() {}

    public ZutatenScore(String zutatName, Integer score) {
        this.zutatName = zutatName;
        this.score = score;
    }

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZutatName() {
        return zutatName;
    }

    public void setZutatName(String zutatName) {
        this.zutatName = zutatName;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "ZutatenScore{" +
                "id=" + id +
                ", zutatName='" + zutatName + '\'' +
                ", score=" + score +
                '}';
    }
}