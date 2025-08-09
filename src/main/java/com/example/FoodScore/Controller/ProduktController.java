package com.example.FoodScore.Controller;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Persistenz.ProduktRepository;
import com.example.FoodScore.Service.ProduktService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/produkte")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduktController {

    private final ProduktService produktService;
    private final ProduktRepository produktRepository;

    public ProduktController(ProduktService produktService, ProduktRepository produktRepository) {
        this.produktService = produktService;
        this.produktRepository = produktRepository;
    }

    @GetMapping
    public List<Produkt> suche(@RequestParam String query) {
        return produktService.sucheProdukte(query);
    }

    @GetMapping("/{id}")
    public Produkt details(@PathVariable Long id) {
        return produktService.findeProdukt(id);
    }

    @GetMapping("/alle")
    public List<Produkt> alleProdukte() {
        return produktService.alleProdukte();
    }

    @GetMapping("/seite")
    public Page<Produkt> produkteSeite(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return produktService.getAlleProdukteSeite(page, size);
    }

    @GetMapping("/kategorien")
    public List<String> alleKategorien() {
        return produktService.getAlleKategorien();
    }

    @GetMapping("/marken")
    public List<String> alleMarken() {
        return produktService.getAlleMarken();
    }

    // NEUE Preis-Range Endpoint
    @GetMapping("/preis-range")
    public Map<String, Double> preisRange() {
        Map<String, Double> range = new HashMap<>();
        range.put("min", produktService.getMinPreis());
        range.put("max", produktService.getMaxPreis());
        return range;
    }


    // Erweiterte gefilterte Suche mit Zutaten in ProduktController.java

    @GetMapping("/gefiltert")
    public Page<Produkt> gefilterteProdukte(
            @RequestParam(required = false) String kategorie,
            @RequestParam(required = false) String marke,
            @RequestParam(required = false) Double minPreis,
            @RequestParam(required = false) Double maxPreis,
            @RequestParam(required = false) String zutat,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        System.out.println("🔍 === GEFILTERTE SUCHE DEBUG ===");
        System.out.println("Zutaten: '" + zutat + "'");

        Page<Produkt> result;

        // Prüfen ob mehrere Zutaten (Komma-getrennt)
        if (zutat != null && zutat.contains(",")) {
            System.out.println("🎯 Multi-Zutaten Suche erkannt!");
            result = produktService.getAlleGefilterteWithMultipleZutaten(kategorie, marke, minPreis, maxPreis, zutat, page, size);
        } else {
            // Einzelne Zutat oder keine
            result = produktService.getAlleGefilterteWithZutaten(kategorie, marke, minPreis, maxPreis, zutat, page, size);
        }

        System.out.println("🔍 ERGEBNIS: " + result.getTotalElements() + " Produkte gefunden");
        return result;
    }

    // Test-Endpoint für mehrere Zutaten
    @GetMapping("/test-multi-zutat")
    public List<Produkt> testMultiZutat(@RequestParam String zutaten) {
        System.out.println("🧪 MULTI TEST: Suche nach Zutaten '" + zutaten + "'");

        // Einfache Implementierung für Test
        String[] parts = zutaten.split(",");
        List<Produkt> alle = produktRepository.findAll();
        List<Produkt> result = new ArrayList<>();

        for (Produkt p : alle) {
            boolean hatAlleZutaten = true;
            for (String zutat : parts) {
                if (p.getZutaten() == null || !p.getZutaten().contains(zutat.trim())) {
                    hatAlleZutaten = false;
                    break;
                }
            }
            if (hatAlleZutaten) {
                result.add(p);
            }
        }

        System.out.println("🧪 GEFUNDEN: " + result.size() + " Produkte");
        return result;
    }

}