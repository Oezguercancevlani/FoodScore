package com.example.FoodScore.Service;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Persistenz.ProduktRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public Page<Produkt> getGefilterte(String kategorie, String marke, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithFilters(kategorie, marke, pageable);
    }

    public Page<Produkt> getAlleGefilterte(String kategorie, String marke, Double minPreis, Double maxPreis, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithAllFilters(kategorie, marke, minPreis, maxPreis, pageable);
    }

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

    public List<Produkt> findeProdukteFuerVergleich(List<Long> produktIds) {
        return produktIds.stream()
                .map(id -> produktRepository.findById(id).orElse(null))
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Page<Produkt> getAlleGefilterteWithZutaten(String kategorie, String marke,
                                                      Double minPreis, Double maxPreis,
                                                      String zutat, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return produktRepository.findWithAllFiltersAndZutaten(kategorie, marke, minPreis, maxPreis, zutat, pageable);
    }

    public Page<Produkt> getAlleGefilterteWithMultipleZutaten(String kategorie, String marke,
                                                              Double minPreis, Double maxPreis,
                                                              String zutaten, int page, int size) {
        List<String> zutatArray = new ArrayList<>();
        if (zutaten != null && !zutaten.trim().isEmpty()) {
            String[] parts = zutaten.split(",");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    zutatArray.add(trimmed);
                }
            }
        }

        if (zutatArray.isEmpty()) {
            Pageable pageable = PageRequest.of(page, size);
            return produktRepository.findWithAllFilters(kategorie, marke, minPreis, maxPreis, pageable);
        } else if (zutatArray.size() == 1) {
            return getAlleGefilterteWithZutaten(kategorie, marke, minPreis, maxPreis, zutatArray.get(0), page, size);
        } else {
            return filterMultipleZutaten(kategorie, marke, minPreis, maxPreis, zutatArray, page, size);
        }
    }

    private Page<Produkt> filterMultipleZutaten(String kategorie, String marke,
                                                Double minPreis, Double maxPreis,
                                                List<String> zutatArray, int page, int size) {
        List<Produkt> alleGefilterten = produktRepository.findWithAllFilters(kategorie, marke, minPreis, maxPreis, Pageable.unpaged()).getContent();

        List<Produkt> result = alleGefilterten.stream()
                .filter(produkt -> {
                    if (produkt.getZutaten() == null) return false;
                    String zutatenText = produkt.getZutaten().toLowerCase();

                    return zutatArray.stream()
                            .allMatch(zutat -> zutatenText.contains(zutat.toLowerCase()));
                })
                .collect(Collectors.toList());

        int totalElements = result.size();
        int start = page * size;
        int end = Math.min(start + size, totalElements);

        List<Produkt> pageContent = result.subList(start, end);
        Pageable pageable = PageRequest.of(page, size);

        return new PageImpl<>(pageContent, pageable, totalElements);
    }
}