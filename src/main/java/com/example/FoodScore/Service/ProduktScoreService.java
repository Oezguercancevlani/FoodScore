package com.example.FoodScore.Service;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Persistenz.ProduktRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ProduktScoreService {

    @Autowired
    private ZutatenDictionary zutatenDictionary;

    @Autowired
    private ProduktRepository produktRepository;

    public double berechneWertungsScore(String zutatenString) {
        if (zutatenString == null || zutatenString.isEmpty()) {
            return 0.0;
        }

        List<ZutatMitAnteil> zutatenListe = parseZutaten(zutatenString);

        if (zutatenListe.isEmpty()) {
            return 0.0;
        }

        double zaehler = 0.0;
        double nenner = 0.0;

        for (int i = 0; i < zutatenListe.size(); i++) {
            ZutatMitAnteil zutat = zutatenListe.get(i);

            int score = zutatenDictionary.getScore(zutat.getName());

            double gewichtungsfaktor = 1.0 / Math.sqrt(i + 1);

            zaehler += score * gewichtungsfaktor;
            nenner += gewichtungsfaktor;
        }

        return nenner > 0 ? zaehler / nenner : 0.0;
    }

    public void berechneUndSpeichereScore(Produkt produkt) {
        if (produkt != null && produkt.getZutaten() != null) {
            double score = berechneWertungsScore(produkt.getZutaten());
            produkt.setWertungsScore(score);
            produktRepository.save(produkt);
        }
    }

    public void berechneScoresFuerAlleProdukte() {
        List<Produkt> alleProdukte = produktRepository.findAll();
        int verarbeitet = 0;

        for (Produkt produkt : alleProdukte) {
            if (produkt.getZutaten() != null && !produkt.getZutaten().trim().isEmpty()) {
                double score = berechneWertungsScore(produkt.getZutaten());
                produkt.setWertungsScore(score);
                verarbeitet++;
            }
        }

        produktRepository.saveAll(alleProdukte);
        System.out.println("✅ Scores für " + verarbeitet + " Produkte berechnet und gespeichert");
    }

    private List<ZutatMitAnteil> parseZutaten(String zutatenString) {
        List<ZutatMitAnteil> zutaten = new ArrayList<>();

        if (zutatenString == null || zutatenString.trim().isEmpty()) {
            return zutaten;
        }

        String bereinigtString = zutatenString
                .replaceAll("(?i)\\. Unter Schutzatmosphäre verpackt.*", "")
                .replaceAll("(?i)Kann Spuren von.*", "")
                .replaceAll("(?i)\\. *\\*aus (?:biologischer|kontrolliert).*", "")
                .replaceAll("(?i)\\. Enthält.*", "")
                .replaceAll("(?i)\\. *\\*\\*.*", "")
                .trim();

        System.out.println(" Bereinigt: '" + bereinigtString + "'");

        Pattern prozentPattern = Pattern.compile("([a-zA-ZäöüÄÖÜßé\\s\\-]+?)\\s*\\((\\d+(?:[.,]\\d+)?)\\s*%\\)");
        Matcher prozentMatcher = prozentPattern.matcher(bereinigtString);

        StringBuffer sb = new StringBuffer();
        while (prozentMatcher.find()) {
            String name = cleanZutatName(prozentMatcher.group(1));
            double anteil = Double.parseDouble(prozentMatcher.group(2).replace(",", "."));

            if (isValidZutatName(name)) {
                zutaten.add(new ZutatMitAnteil(name, anteil));
                System.out.println("✅ Prozent-Pattern: '" + name + "' -> " + anteil + "%");
            }

            prozentMatcher.appendReplacement(sb, " "); // Ersetze durch Leerzeichen
        }
        prozentMatcher.appendTail(sb);
        bereinigtString = sb.toString();

        if (!bereinigtString.trim().isEmpty()) {
            String[] teile = smartSplit(bereinigtString);

            for (String teil : teile) {
                String cleanTeil = cleanZutatName(teil);

                if (isValidZutatName(cleanTeil)) {
                    zutaten.add(new ZutatMitAnteil(cleanTeil, 0));
                    System.out.println("✅ Komma-Pattern: '" + cleanTeil + "'");
                }
            }
        }

        System.out.println("🔍 === PARSING ENDE: " + zutaten.size() + " Zutaten gefunden ===");
        return zutaten;
    }

    private String[] smartSplit(String text) {
        List<String> teile = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        int klammerLevel = 0;

        for (char c : text.toCharArray()) {
            if (c == '(' || c == '[') {
                klammerLevel++;
                current.append(c);
            } else if (c == ')' || c == ']') {
                klammerLevel--;
                current.append(c);
            } else if (c == ',' && klammerLevel == 0) {
                teile.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }

        if (current.length() > 0) {
            teile.add(current.toString().trim());
        }

        return teile.toArray(new String[0]);
    }

    private String cleanZutatName(String name) {
        if (name == null) return "";

        return name.trim()
                .replaceAll("^[\\d\\s*%\\\\\\[\\(\\-\"']+", "")
                .replaceAll("[\\s*%\\\\\\]\\)\\-\"'.,:;!?]+$", "")
                .replaceAll("\\s+", " ")
                .trim()
                .toLowerCase();
    }

    private boolean isValidZutatName(String name) {
        if (name == null || name.length() < 2) return false;

        if (name.matches("^[\\d\\s%\\-\\.,:;]+$")) return false;

        if (name.matches("(?i).*(aus biologischer|kann spuren|enthält|unter schutz|zertifiziert|rainforest).*")) return false;

        if (name.matches("^[.\\-:;,\\[\\]\\(\\)]+$")) return false;

        if (name.replaceAll("[^a-zA-ZäöüÄÖÜß]", "").length() < 2) return false;

        if (name.startsWith("*") && name.endsWith("*")) return false;
        if (name.matches("^\\s*\\**\\s*$")) return false; // Nur Sterne

        return true;
    }

    private static class ZutatMitAnteil {
        private String name;
        private double anteil;

        public ZutatMitAnteil(String name, double anteil) {
            this.name = name;
            this.anteil = anteil;
        }

        public String getName() {
            return name;
        }

        public double getAnteil() {
            return anteil;
        }
    }
}