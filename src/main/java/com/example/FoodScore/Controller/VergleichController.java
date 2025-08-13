package com.example.FoodScore.Controller;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Service.ProduktService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/vergleich")
@CrossOrigin
public class VergleichController {

    private final ProduktService produktService;

    public VergleichController(ProduktService produktService) {
        this.produktService = produktService;
    }

    @PostMapping("/produkte")
    public ResponseEntity<Map<String, Object>> vergleicheProdukte(@RequestBody List<Long> produktIds) {
        if (produktIds == null || produktIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Keine Produkt-IDs angegeben"));
        }

        if (produktIds.size() > 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "Maximal 5 Produkte können verglichen werden"));
        }

        if (produktIds.size() < 2) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mindestens 2 Produkte müssen für einen Vergleich angegeben werden"));
        }

        List<Produkt> produkte = produktService.findeProdukteFuerVergleich(produktIds);

        if (produkte.size() != produktIds.size()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Einige Produkte konnten nicht gefunden werden"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("produkte", produkte);
        response.put("vergleichsanalyse", erstelleVergleichsanalyse(produkte));

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> erstelleVergleichsanalyse(List<Produkt> produkte) {
        Map<String, Object> analyse = new HashMap<>();

        Map<String, Map<String, Object>> naehrwerte = new HashMap<>();

        naehrwerte.put("kalorien", vergleicheNaehrwert(produkte, Produkt::getEnergieKcal, "kcal"));
        naehrwerte.put("fett", vergleicheNaehrwert(produkte, Produkt::getFett, "g"));
        naehrwerte.put("gesaettigteFettsaueren", vergleicheNaehrwert(produkte, Produkt::getGesaettigteFettsaueren, "g"));
        naehrwerte.put("kohlenhydrate", vergleicheNaehrwert(produkte, Produkt::getKohlenhydrate, "g"));
        naehrwerte.put("eiweiss", vergleicheNaehrwert(produkte, Produkt::getEiweiss, "g"));
        naehrwerte.put("zucker", vergleicheNaehrwert(produkte, Produkt::getZucker, "g"));
        naehrwerte.put("salz", vergleicheNaehrwert(produkte, Produkt::getSalz, "g"));

        analyse.put("naehrwerte", naehrwerte);

        analyse.put("scores", vergleicheScores(produkte));

        analyse.put("preise", vergleichePreise(produkte));

        analyse.put("kategorien", vergleicheKategorien(produkte));

        return analyse;
    }

    private Map<String, Object> vergleicheScores(List<Produkt> produkte) {
        Map<String, Object> scoreVergleich = new HashMap<>();

        Double minScore = null, maxScore = null;
        Long besteScoreId = null, schlechtesteScoreId = null;
        int validScores = 0;
        double durchschnitt = 0.0;

        for (Produkt produkt : produkte) {
            Double score = produkt.getWertungsScore();
            if (score != null) {
                validScores++;
                durchschnitt += score;

                if (minScore == null || score < minScore) {
                    minScore = score;
                    schlechtesteScoreId = produkt.getId();
                }
                if (maxScore == null || score > maxScore) {
                    maxScore = score;
                    besteScoreId = produkt.getId();
                }
            }
        }

        if (validScores > 0) {
            durchschnitt = durchschnitt / validScores;
        }

        scoreVergleich.put("minScore", minScore);
        scoreVergleich.put("maxScore", maxScore);
        scoreVergleich.put("durchschnitt", Math.round(durchschnitt * 100.0) / 100.0);
        scoreVergleich.put("besteScoreId", besteScoreId);
        scoreVergleich.put("schlechtesteScoreId", schlechtesteScoreId);
        scoreVergleich.put("validScores", validScores);
        scoreVergleich.put("einheit", "Punkte");

        return scoreVergleich;
    }

    private Map<String, Object> vergleicheNaehrwert(List<Produkt> produkte,
                                                    java.util.function.Function<Produkt, String> getter,
                                                    String einheit) {
        Map<String, Object> vergleich = new HashMap<>();

        Double min = null, max = null;
        Long minProduktId = null, maxProduktId = null;
        int validValues = 0;

        for (Produkt produkt : produkte) {
            String wertStr = getter.apply(produkt);
            if (wertStr != null && !wertStr.trim().isEmpty()) {
                try {
                    String cleanWert = wertStr.replaceAll("[^0-9.,]", "").replace(",", ".");
                    cleanWert = cleanWert.replaceAll("^[.]+|[.]+$", "");

                    if (!cleanWert.isEmpty() && !cleanWert.equals(".")) {
                        Double wert = Double.parseDouble(cleanWert);
                        validValues++;

                        if (min == null || wert < min) {
                            min = wert;
                            minProduktId = produkt.getId();
                        }
                        if (max == null || wert > max) {
                            max = wert;
                            maxProduktId = produkt.getId();
                        }
                    }
                } catch (NumberFormatException e) {
                }
            }
        }

        vergleich.put("min", min);
        vergleich.put("max", max);
        vergleich.put("minProduktId", minProduktId);
        vergleich.put("maxProduktId", maxProduktId);
        vergleich.put("einheit", einheit);
        vergleich.put("validValues", validValues);

        return vergleich;
    }

    private Map<String, Object> vergleichePreise(List<Produkt> produkte) {
        Map<String, Object> preisVergleich = new HashMap<>();

        Double minPreis = null, maxPreis = null;
        Long guenstigsteId = null, teuersteId = null;
        int validPrices = 0;

        for (Produkt produkt : produkte) {
            String preisStr = produkt.getPreis();
            if (preisStr != null && !preisStr.trim().isEmpty()) {
                try {
                    String cleanPreis = preisStr.replace(",", ".");
                    Double preis = Double.parseDouble(cleanPreis);
                    validPrices++;

                    if (minPreis == null || preis < minPreis) {
                        minPreis = preis;
                        guenstigsteId = produkt.getId();
                    }
                    if (maxPreis == null || preis > maxPreis) {
                        maxPreis = preis;
                        teuersteId = produkt.getId();
                    }
                } catch (NumberFormatException e) {
                }
            }
        }

        preisVergleich.put("minPreis", minPreis);
        preisVergleich.put("maxPreis", maxPreis);
        preisVergleich.put("guenstigsteId", guenstigsteId);
        preisVergleich.put("teuersteId", teuersteId);
        preisVergleich.put("validPrices", validPrices);

        return preisVergleich;
    }

    private Map<String, Object> vergleicheKategorien(List<Produkt> produkte) {
        Map<String, Object> kategorienVergleich = new HashMap<>();

        Map<String, Integer> kategorienCount = new HashMap<>();
        boolean alleSameKategorie = true;
        String ersteKategorie = null;

        for (Produkt produkt : produkte) {
            String kategorie = produkt.getKategorie();
            if (kategorie != null) {
                if (ersteKategorie == null) {
                    ersteKategorie = kategorie;
                } else if (!kategorie.equals(ersteKategorie)) {
                    alleSameKategorie = false;
                }

                kategorienCount.put(kategorie, kategorienCount.getOrDefault(kategorie, 0) + 1);
            }
        }

        kategorienVergleich.put("alleSameKategorie", alleSameKategorie);
        kategorienVergleich.put("kategorienVerteilung", kategorienCount);

        return kategorienVergleich;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Vergleichs-Controller funktioniert!");
    }
}