package com.example.FoodScore.Persistenz;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduktRepository extends JpaRepository<Produkt, Long> {

    @Query("SELECT p FROM Produkt p WHERE LOWER(p.name) LIKE LOWER(CONCAT(:q, '%'))")
    List<Produkt> searchByName(@Param("q") String query);

    @Query("SELECT DISTINCT p.kategorie FROM Produkt p WHERE p.kategorie IS NOT NULL ORDER BY p.kategorie")
    List<String> findAllKategorien();

    @Query("SELECT DISTINCT p.marke FROM Produkt p WHERE p.marke IS NOT NULL ORDER BY p.marke")
    List<String> findAllMarken();

    @Query("SELECT p FROM Produkt p WHERE " +
            "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
            "(:marke IS NULL OR p.marke = :marke) AND " +
            "(:minPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double) >= :minPreis) AND " +
            "(:maxPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double) <= :maxPreis)")
    Page<Produkt> findWithAllFilters(@Param("kategorie") String kategorie,
                                     @Param("marke") String marke,
                                     @Param("minPreis") Double minPreis,
                                     @Param("maxPreis") Double maxPreis,
                                     Pageable pageable);

    @Query("SELECT p FROM Produkt p WHERE " +
            "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
            "(:marke IS NULL OR p.marke = :marke)")
    Page<Produkt> findWithFilters(@Param("kategorie") String kategorie,
                                  @Param("marke") String marke,
                                  Pageable pageable);

    @Query("SELECT MIN(CAST(REPLACE(p.preis, ',', '.') AS double)) FROM Produkt p WHERE p.preis IS NOT NULL AND p.preis != ''")
    Double findMinPreis();

    @Query("SELECT MAX(CAST(REPLACE(p.preis, ',', '.') AS double)) FROM Produkt p WHERE p.preis IS NOT NULL AND p.preis != ''")
    Double findMaxPreis();

    // FUNKTIONALE Multi-Zutaten Suche mit Native SQL für PostgreSQL
    @Query(value = "SELECT * FROM produkt p WHERE " +
            "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
            "(:marke IS NULL OR p.marke = :marke) AND " +
            "(:minPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) >= :minPreis) AND " +
            "(:maxPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) <= :maxPreis) AND " +
            "(:#{#zutatArray.size()} = 0 OR " +
            "(SELECT COUNT(*) FROM unnest(CAST(:zutatArray AS text[])) AS zutat " +
            "WHERE LOWER(p.zutaten) LIKE LOWER(CONCAT('%', TRIM(zutat), '%'))) = :#{#zutatArray.size()})",
            countQuery = "SELECT COUNT(*) FROM produkt p WHERE " +
                    "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
                    "(:marke IS NULL OR p.marke = :marke) AND " +
                    "(:minPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) >= :minPreis) AND " +
                    "(:maxPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) <= :maxPreis) AND " +
                    "(:#{#zutatArray.size()} = 0 OR " +
                    "(SELECT COUNT(*) FROM unnest(CAST(:zutatArray AS text[])) AS zutat " +
                    "WHERE LOWER(p.zutaten) LIKE LOWER(CONCAT('%', TRIM(zutat), '%'))) = :#{#zutatArray.size()})",
            nativeQuery = true)
    Page<Produkt> findWithAllFiltersAndMultipleZutaten(@Param("kategorie") String kategorie,
                                                       @Param("marke") String marke,
                                                       @Param("minPreis") Double minPreis,
                                                       @Param("maxPreis") Double maxPreis,
                                                       @Param("zutatArray") List<String> zutatArray,
                                                       Pageable pageable);

    // Einfache Version für einzelne Zutat
    @Query("SELECT p FROM Produkt p WHERE " +
            "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
            "(:marke IS NULL OR p.marke = :marke) AND " +
            "(:minPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double) >= :minPreis) AND " +
            "(:maxPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double) <= :maxPreis) AND " +
            "(:zutat IS NULL OR :zutat = '' OR p.zutaten LIKE CONCAT('%', :zutat, '%'))")
    Page<Produkt> findWithAllFiltersAndZutaten(@Param("kategorie") String kategorie,
                                               @Param("marke") String marke,
                                               @Param("minPreis") Double minPreis,
                                               @Param("maxPreis") Double maxPreis,
                                               @Param("zutat") String zutat,
                                               Pageable pageable);

    // Debug-Query
    @Query("SELECT p FROM Produkt p WHERE p.zutaten LIKE CONCAT('%', :zutat, '%')")
    List<Produkt> findByZutatOnly(@Param("zutat") String zutat);

    // Zusätzliche Hilfsmethode für bessere Performance bei vielen Zutaten
    @Query(value = "SELECT * FROM produkt p WHERE " +
            "(:kategorie IS NULL OR p.kategorie = :kategorie) AND " +
            "(:marke IS NULL OR p.marke = :marke) AND " +
            "(:minPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) >= :minPreis) AND " +
            "(:maxPreis IS NULL OR CAST(REPLACE(p.preis, ',', '.') AS double precision) <= :maxPreis)",
            nativeQuery = true)
    List<Produkt> findAllWithBasicFilters(@Param("kategorie") String kategorie,
                                          @Param("marke") String marke,
                                          @Param("minPreis") Double minPreis,
                                          @Param("maxPreis") Double maxPreis);
}