package com.example.FoodScore.Service;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Persistenz.ProduktRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduktService {

    private final ProduktRepository produktRepository;

    public ProduktService(ProduktRepository produktRepository) {
        this.produktRepository = produktRepository;
    }

    public List<Produkt> sucheProdukte(String query) {
        return produktRepository.searchByName(query);
    }

    public List<Produkt> alleProdukte() {
        return produktRepository.findAll();
    }

    public Page<Produkt> getAlleProdukteSeite(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findAll(pageable);
    }

    public List<String> getAlleKategorien() {
        return produktRepository.findAllKategorien();
    }

    public List<String> getAlleMarken() {
        return produktRepository.findAllMarken();
    }

    // Alte Methode für Kompatibilität
    public Page<Produkt> getGefilterte(String kategorie, String marke, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithFilters(kategorie, marke, pageable);
    }

    // NEUE Methode mit Preis-Filter
    public Page<Produkt> getAlleGefilterte(String kategorie, String marke, Double minPreis, Double maxPreis, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithAllFilters(kategorie, marke, minPreis, maxPreis, pageable);
    }

    // Preis-Range für Frontend
    public Double getMinPreis() {
        Double min = produktRepository.findMinPreis();
        return min != null ? min : 0.0;
    }

    public Double getMaxPreis() {
        Double max = produktRepository.findMaxPreis();
        return max != null ? max : 100.0;
    }

    public Produkt findeProdukt(Long id) {
        return produktRepository.findById(id).orElseThrow();
    }

    // Neue Methode in ProduktService.java
    public Page<Produkt> getAlleGefilterteWithZutaten(String kategorie, String marke,
                                                      Double minPreis, Double maxPreis,
                                                      String zutat, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithAllFiltersAndZutaten(kategorie, marke, minPreis, maxPreis, zutat, pageable);
    }
}