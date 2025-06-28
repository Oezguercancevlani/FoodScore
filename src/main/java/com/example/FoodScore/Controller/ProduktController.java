package com.example.FoodScore.Controller;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Service.ProduktService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produkte")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProduktController {

    private final ProduktService produktService;

    @GetMapping
    public List<Produkt> suche(@RequestParam String query) {
        return produktService.sucheProdukte(query);
    }

    @GetMapping("/{id}")
    public Produkt details(@PathVariable Long id) {
        return produktService.findeProdukt(id);
    }
}
