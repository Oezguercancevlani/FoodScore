package com.example.FoodScore.Persistenz;

import jakarta.persistence.*;


import java.math.BigDecimal;

@Entity

public class Produkt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMarke() {
        return marke;
    }

    public void setMarke(String marke) {
        this.marke = marke;
    }

    public String getKategorie() {
        return kategorie;
    }

    public void setKategorie(String kategorie) {
        this.kategorie = kategorie;
    }

    public String getZutaten() {
        return zutaten;
    }

    public void setZutaten(String zutaten) {
        this.zutaten = zutaten;
    }

    public String getEnergieKcal() {
        return energieKcal;
    }

    public void setEnergieKcal(String energieKcal) {
        this.energieKcal = energieKcal;
    }

    public String getFett() {
        return fett;
    }

    public void setFett(String fett) {
        this.fett = fett;
    }

    public String getEnergieKj() {
        return energieKj;
    }

    public void setEnergieKj(String energieKj) {
        this.energieKj = energieKj;
    }

    public String getGesaettigteFettsaueren() {
        return gesaettigteFettsaueren;
    }

    public void setGesaettigteFettsaueren(String gesaettigteFettsaueren) {
        this.gesaettigteFettsaueren = gesaettigteFettsaueren;
    }

    public String getKohlenhydrate() {
        return kohlenhydrate;
    }

    public void setKohlenhydrate(String kohlenhydrate) {
        this.kohlenhydrate = kohlenhydrate;
    }

    public String getZucker() {
        return zucker;
    }

    public void setZucker(String zucker) {
        this.zucker = zucker;
    }

    public String getEiweiss() {
        return eiweiss;
    }

    public void setEiweiss(String eiweiss) {
        this.eiweiss = eiweiss;
    }

    public String getSalz() {
        return salz;
    }

    public void setSalz(String salz) {
        this.salz = salz;
    }

    public Long getEan() {
        return ean;
    }

    public void setEan(Long ean) {
        this.ean = ean;
    }

    public String getPreis() {
        return preis;
    }

    public void setPreis(String preis) {
        this.preis = preis;
    }

    public String getBildUrl() {
        return bildUrl;
    }

    public void setBildUrl(String bildUrl) {
        this.bildUrl = bildUrl;
    }

    public String getQuelleUrl() {
        return quelleUrl;
    }

    public void setQuelleUrl(String quelleUrl) {
        this.quelleUrl = quelleUrl;
    }

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
