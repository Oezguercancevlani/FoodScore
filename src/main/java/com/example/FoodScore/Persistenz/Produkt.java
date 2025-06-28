package com.example.FoodScore.Persistenz;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class Produkt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String name;

    @Column(columnDefinition = "TEXT")
    private String marke;

    @Column(columnDefinition = "TEXT")
    private String kategorie;

    @Column(columnDefinition = "TEXT")
    private String zutaten;

    @Column(columnDefinition = "TEXT")
    private String energieKj;

    @Column(columnDefinition = "TEXT")
    private String energieKcal;

    @Column(columnDefinition = "TEXT")
    private String fett;

    @Column(columnDefinition = "TEXT")
    private String gesaettigteFettsaueren;

    @Column(columnDefinition = "TEXT")
    private String kohlenhydrate;

    @Column(columnDefinition = "TEXT")
    private String zucker;

    @Column(columnDefinition = "TEXT")
    private String eiweiss;

    @Column(columnDefinition = "TEXT")
    private String salz;

    private Long ean;

    @Column(columnDefinition = "TEXT")
    private String preis;
    @Column(columnDefinition = "TEXT")
    private String bildUrl;
    @Column(columnDefinition = "TEXT")
    private String quelleUrl;


}
