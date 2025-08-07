package com.example.FoodScore.Controller;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Service.ProduktService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/produkte")
@CrossOrigin(origins = "http://localhost:5173")
public class ProduktController {

    private final ProduktService produktService;

    public ProduktController(ProduktService produktService) {
        this.produktService = produktService;
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

    // ERWEITERTE gefilterte Suche mit Preis
    @GetMapping("/gefiltert")
    public Page<Produkt> gefilterteProdukte(
            @RequestParam(required = false) String kategorie,
            @RequestParam(required = false) String marke,
            @RequestParam(required = false) Double minPreis,
            @RequestParam(required = false) Double maxPreis,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return produktService.getAlleGefilterte(kategorie, marke, minPreis, maxPreis, page, size);
    }
}