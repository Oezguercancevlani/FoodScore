package com.example.FoodScore.Service;

import com.example.FoodScore.Persistenz.Produkt;
import com.example.FoodScore.Persistenz.ProduktRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduktService {

    private final ProduktRepository produktRepository;

    public List<Produkt> sucheProdukte(String query) {
        return produktRepository.searchByName(query);
    }

    public Produkt findeProdukt(Long id) {
        return produktRepository.findById(id).orElseThrow();
    }
}

