package com.example.FoodScore.Service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ZutatenFileLoader {

    public Map<String, Integer> loadZutatenFromPythonFile() {
        Map<String, Integer> zutatenScores = new HashMap<>();

        try {
            ClassPathResource resource = new ClassPathResource("Zutatenliste mit Scores.py");

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                String line;
                Pattern pattern = Pattern.compile("^\\s*([^:]+?):\\s*(\\d+),?\\s*$");

                while ((line = reader.readLine()) != null) {
                    line = line.trim();

                    if (line.startsWith("#") || line.isEmpty() ||
                            line.contains("ZUTATEN_LISTE") || line.contains("[") || line.contains("]")) {
                        continue;
                    }

                    Matcher matcher = pattern.matcher(line);
                    if (matcher.find()) {
                        String zutat = matcher.group(1).trim();
                        int score = Integer.parseInt(matcher.group(2));

                        zutat = bereinigueZutatName(zutat);

                        if (isValidZutat(zutat)) {
                            zutatenScores.put(zutat, score);
                        }
                    }
                }

            }

            System.out.println("✅ Zutatenliste aus Python-Datei geladen: " + zutatenScores.size() + " Einträge");

        } catch (Exception e) {
            System.err.println("❌ Fehler beim Laden der Python-Datei: " + e.getMessage());
            e.printStackTrace();

            return getFallbackScores();
        }

        return zutatenScores;
    }


    private String bereinigueZutatName(String zutat) {
        return zutat
                .toLowerCase()
                .replaceAll("^[\"'\\s*%\\\\\\[\\(]+", "")
                .replaceAll("[\"'\\s*%\\\\\\]\\)]+$", "")
                .replaceAll("[.;,!?]+$", "")
                .replaceAll("\\*+", "")
                .replaceAll("\\s+", " ")
                .trim();
    }


    private boolean isValidZutat(String zutat) {
        if (zutat == null || zutat.length() < 2) return false;

        if (zutat.matches("^[\\d\\s%\\-\\.]+$")) return false;
        if (zutat.contains("aus biologischer") || zutat.contains("kann spuren")) return false;
        if (zutat.equals(".") || zutat.equals("-") || zutat.equals(":")) return false;

        return true;
    }

    private Map<String, Integer> getFallbackScores() {
        Map<String, Integer> fallback = new HashMap<>();

        fallback.put("äpfel", 95);
        fallback.put("heidelbeeren", 98);
        fallback.put("wasser", 100);
        fallback.put("tomaten", 98);
        fallback.put("zucker", 10);
        fallback.put("salz", 5);
        return fallback;
    }
}