package com.example.FoodScore.Controller;

import com.example.FoodScore.Service.ProduktScoreService;
import com.example.FoodScore.Service.ZutatenDictionary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/score")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduktScoreController {

    @Autowired
    private ProduktScoreService produktScoreService;

    @Autowired
    private ZutatenDictionary zutatenDictionary;

    @PostMapping("/calculate")
    public ResponseEntity<Double> calculateScore(@RequestBody String zutatenString) {
        try {
            double score = produktScoreService.berechneWertungsScore(zutatenString);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            System.err.println("❌ Fehler bei Score-Berechnung: " + e.getMessage());
            return ResponseEntity.ok(0.0);
        }
    }

    @PostMapping("/calculate-all")
    public ResponseEntity<Map<String, Object>> calculateAllProductScores() {
        try {
            System.out.println("🚀 Starte Berechnung aller Produkt-Scores...");
            produktScoreService.berechneScoresFuerAlleProdukte();

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Alle Produkt-Scores wurden berechnet und gespeichert");
            response.put("timestamp", System.currentTimeMillis());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Fehler beim Berechnen aller Scores: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Fehler beim Berechnen der Scores: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testWithSampleProduct() {
        try {
            String testZutaten = "VOLLKORNWEIZENMEHL, Wasser, Hefe, Salz";

            Map<String, Object> response = new HashMap<>();
            response.put("eingabe", testZutaten);
            response.put("anzahlBekannteZutaten", zutatenDictionary.getAnzahlZutaten());
            response.put("score", produktScoreService.berechneWertungsScore(testZutaten));
            response.put("status", "OK");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Fehler im Test-Endpoint: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Fehler beim Testen: " + e.getMessage());
            return ResponseEntity.ok(errorResponse);
        }
    }

    @GetMapping("/dictionary")
    public ResponseEntity<Map<String, Object>> showDictionary() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("anzahlZutaten", zutatenDictionary.getAnzahlZutaten());
            response.put("zutatenScores", zutatenDictionary.getAllScores());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Fehler beim Abrufen des Dictionary: " + e.getMessage());
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    // NEU: Gefilterte Zutatenliste für die Suchfunktion
    @GetMapping("/dictionary/search")
    public ResponseEntity<Map<String, Object>> searchZutaten(@RequestParam String query) {
        try {
            Map<String, Integer> allScores = zutatenDictionary.getAllScores();

            // Filtere nach Suchanfrage
            Map<String, Integer> filteredScores = allScores.entrySet().stream()
                    .filter(entry -> entry.getKey().toLowerCase().contains(query.toLowerCase()))
                    .collect(Collectors.toMap(
                            Map.Entry::getKey,
                            Map.Entry::getValue
                    ));

            Map<String, Object> response = new HashMap<>();
            response.put("query", query);
            response.put("anzahlGefunden", filteredScores.size());
            response.put("zutatenScores", filteredScores);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Fehler bei der Zutaten-Suche: " + e.getMessage());
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Score-Service läuft!");
    }

    @GetMapping("/debug-zutat")
    public ResponseEntity<Map<String, Object>> debugZutat(@RequestParam String zutat) {
        Map<String, Object> response = new HashMap<>();

        response.put("originalInput", zutat);

        String normalized = zutat.toLowerCase().trim()
                .replaceAll("[.;,!?]+$", "")
                .replaceAll("[.;,]", "")
                .replaceAll("\\s+", " ")
                .trim();
        response.put("normalizedInput", normalized);

        int score = zutatenDictionary.getScore(zutat);
        response.put("gefundenerScore", score);

        Map<String, Integer> allScores = zutatenDictionary.getAllScores();
        Map<String, Integer> matchingEntries = new HashMap<>();

        for (Map.Entry<String, Integer> entry : allScores.entrySet()) {
            if (entry.getKey().contains("hähnchen") || entry.getKey().contains("huhn")) {
                matchingEntries.put(entry.getKey(), entry.getValue());
            }
        }
        response.put("hähnchenEinträge", matchingEntries);

        response.put("dictionaryGröße", allScores.size());

        return ResponseEntity.ok(response);
    }
}