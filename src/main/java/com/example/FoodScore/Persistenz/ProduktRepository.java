package com.example.FoodScore.Persistenz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository <Produkt,Long> {

    @Query("SELECT p FROM Produkt p WHERE LOWER(p.name) LIKE LOWER(CONCAT(:q, '%'))")
    List<Produkt> searchByName(@Param("q") String query);


}
