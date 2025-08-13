package com.example.FoodScore.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ZutatenDictionary {

    private final Map<String, Integer> zutatenScores;
    private final ZutatenFileLoader fileLoader;

    public ZutatenDictionary(@Autowired ZutatenFileLoader fileLoader) {
        this.fileLoader = fileLoader;
        this.zutatenScores = new HashMap<>();
        initializeScores();
    }

    private void initializeScores() {
        try {
            Map<String, Integer> loadedScores = fileLoader.loadZutatenFromPythonFile();
            zutatenScores.putAll(loadedScores);

            System.out.println("✅ ZutatenDictionary initialisiert mit " + zutatenScores.size() + " Zutaten aus der Kollegen-Datei");

            zutatenScores.entrySet().stream()
                    .limit(10)
                    .forEach(entry -> System.out.println(" - " + entry.getKey() + ": " + entry.getValue()));

        } catch (Exception e) {
            System.err.println("❌ Fehler beim Initialisieren: " + e.getMessage());
            initializeFallbackScores();
        }
    }

    private void initializeFallbackScores() {
        zutatenScores.put("äpfel", 95);
        zutatenScores.put("heidelbeeren", 98);
        zutatenScores.put("wasser", 100);
        zutatenScores.put("tomaten", 98);
        zutatenScores.put("zucker", 10);
        System.out.println("⚠️ Fallback-Scores initialisiert");
    }


    public int getScore(String zutatName) {
        if (zutatName == null || zutatName.trim().isEmpty()) {
            return 50;
        }

        String normalizedName = normalizeZutat(zutatName);
        System.out.println("🔍 Score-Suche: '" + zutatName + "' → normalisiert: '" + normalizedName + "'");

        if (zutatenScores.containsKey(normalizedName)) {
            int score = zutatenScores.get(normalizedName);
            System.out.println("✅ Exakter Match gefunden: " + score);
            return score;
        }

        Map<String, Integer> candidates = new HashMap<>();

        for (Map.Entry<String, Integer> entry : zutatenScores.entrySet()) {
            String dictKey = entry.getKey();

            if (normalizedName.contains(dictKey) || dictKey.contains(normalizedName)) {
                candidates.put(dictKey, entry.getValue());
            }

            String[] normalizedWords = normalizedName.split("\\s+");
            String[] dictWords = dictKey.split("\\s+");

            for (String normalizedWord : normalizedWords) {
                if (normalizedWord.length() >= 3) {
                    for (String dictWord : dictWords) {
                        if (dictWord.length() >= 3 &&
                                (normalizedWord.equals(dictWord) ||
                                        normalizedWord.contains(dictWord) ||
                                        dictWord.contains(normalizedWord))) {
                            candidates.put(dictKey, entry.getValue());
                            break;
                        }
                    }
                }
            }
        }

        if (!candidates.isEmpty()) {
            String bestMatch = candidates.keySet().stream()
                    .max((k1, k2) -> Integer.compare(k1.length(), k2.length()))
                    .orElse("");

            int score = candidates.get(bestMatch);
            System.out.println("✅ Bester Partial Match: '" + bestMatch + "' → " + score);
            return score;
        }

        System.out.println("❌ Kein Match für: '" + normalizedName + "'");
        return 50;
    }

    public void addScore(String zutatName, int score) {
        if (zutatName != null && !zutatName.trim().isEmpty()) {
            zutatenScores.put(normalizeZutat(zutatName), score);
        }
    }

    public Map<String, Integer> getAllScores() {
        return new HashMap<>(zutatenScores);
    }

    public int getAnzahlZutaten() {
        return zutatenScores.size();
    }


    private String normalizeZutat(String zutat) {
        if (zutat == null) return "";

        return zutat.toLowerCase()
                .trim()
                .replaceAll("\\([^)]*\\)", "")
                .replaceAll("\\[[^]]*\\]", "")
                .replaceAll("[.;,!?:]+$", "")
                .replaceAll("[.;,:]", "")
                .replaceAll("[*°\\\\]+", "")
                .replaceAll("\\s+", " ")
                .replaceAll("^[-\\s]+|[-\\s]+$", "")
                .trim();
    }
}